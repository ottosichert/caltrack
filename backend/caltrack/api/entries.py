from datetime import timezone

import dateutil.parser
from flask import current_app
from flask_restful import Resource, fields, marshal_with, reqparse

db = current_app.extensions['db']
models = current_app.extensions['models']
api = current_app.extensions['api']
auth = current_app.extensions['auth']


class UtcDateTime(fields.DateTime):
    """Given UTC datetime strings, ensure the UTC timezone is actually set"""

    def format(self, value):
        return super(UtcDateTime, self).format(value.replace(tzinfo=timezone.utc))


class AuthorizedInteger(fields.Integer):
    """Protect an integer field with a role"""

    def __init__(self, role, *args, **kwargs):
        self.role = role
        super(AuthorizedInteger, self).__init__(*args, **kwargs)

    def format(self, value):
        if auth.get_current_user().has_role(self.role):
            return super(AuthorizedInteger, self).format(value)
        return None


def to_datetime(value):
    return dateutil.parser.parse(value)


def to_time(value):
    return dateutil.parser.parse(value).time()


def to_authorized(role, sub_type, default):
    """Wrapper to provide default value if role authorization fails"""

    def authorized_type(*args, **kwargs):
        user = auth.get_current_user()
        if user.has_role(role):
            return sub_type(*args, **kwargs)
        current_app.logger.info(f'Unauthorized parameter attempt from {user}')
        return default()
    return authorized_type


entry_fields = {
    'id': fields.Integer,
    'user_id': AuthorizedInteger('Admin'),
    'label': fields.String,
    'datetime': UtcDateTime(dt_format='iso8601'),
    'calories': fields.Integer,
}
list_fields = {
    **entry_fields,
    'calories_exceeded': fields.Boolean,
}

entry_parser = reqparse.RequestParser()
entry_parser.add_argument('label', type=str, required=True)
entry_parser.add_argument('calories', type=int, required=True)
entry_parser.add_argument('datetime', type=to_datetime)
entry_parser.add_argument(
    'user_id',
    type=to_authorized('Admin', lambda id: models.User.query.get(id), auth.get_current_user),
    default=auth.get_current_user,
    dest='user'
)

filter_parser = reqparse.RequestParser()
filter_parser.add_argument('from_date', type=to_datetime, location='args')
filter_parser.add_argument('to_date', type=to_datetime, location='args')
filter_parser.add_argument('to_time', type=to_time, location='args')
filter_parser.add_argument('from_time', type=to_time, location='args')
filter_parser.add_argument('timezone_offset', type=int, location='args', default=0)
filter_parser.add_argument(
    'user_id',
    type=to_authorized('Admin', lambda id: models.User.query.get(id), auth.get_current_user),
    location='args',
    default=auth.get_current_user,
    dest='user'
)


class EntryList(Resource):
    @marshal_with(list_fields)
    @auth.login_required
    def get(self):
        """Perform time filtering in this controller as all datetimes are stored in UTC"""

        args = filter_parser.parse_args()
        user_filter = (models.Entry.user == args['user'])
        query = db.session.query(models.Entry).filter(user_filter)
        offset = f"{-args['timezone_offset']} minutes"
        time = db.func.time(models.Entry.datetime, offset)
        date = db.func.date(models.Entry.datetime, offset)

        if args['from_date']:
            query = query.filter(models.Entry.datetime >= args['from_date'])
        if args['to_date']:
            query = query.filter(models.Entry.datetime <= args['to_date'])
        if args['from_time']:
            query = query.filter(time >= str(args['from_time']))
        if args['to_time']:
            query = query.filter(time <= str(args['to_time']))

        # construct subqueries to annotate each row with daily calories exceeded or not
        visible_dates = db.session.query(date).filter(
            models.Entry.id.in_(query.options(db.load_only('id')).subquery())
        ).distinct().subquery()

        calories_exceeded = db.session.query(
            (db.func.sum(models.Entry.calories) > args['user'].daily_calories).label('calories_exceeded'),
            date.label('date')
        ).filter(user_filter, date.in_(visible_dates)).group_by(date).subquery()

        query = query.join(calories_exceeded, date == calories_exceeded.c.date).with_entities(
            models.Entry,
            calories_exceeded.c.calories_exceeded
        )

        # manually create dict for serialization as a shortcut to avoid creating a SQLAlchemy mapper
        return [
            {**entry.__dict__, 'calories_exceeded': entry_calories_exceeded}
            for (entry, entry_calories_exceeded) in query.order_by(models.Entry.datetime).all()
        ]

    @marshal_with(entry_fields)
    @auth.login_required
    def post(self):
        """Simply create an entry with validate arguments from parser"""

        args = entry_parser.parse_args(strict=True)
        entry = models.Entry(**args)
        db.session.add(entry)
        db.session.commit()
        current_app.logger.debug(f'Created {entry}')
        return entry


class Entry(Resource):
    @marshal_with(entry_fields)
    @auth.ownership_required(models.Entry)
    def patch(self, id=None):
        """Ignore empty fields as user_id can be None on failed role authorization"""

        args = entry_parser.parse_args(strict=True)
        entry = models.Entry.query.get(id)
        for key, value in args.items():
            if value is not None:
                setattr(entry, key, value)
        db.session.commit()
        return entry

    @marshal_with(entry_fields)
    @auth.ownership_required(models.Entry)
    def delete(self, id=None):
        """Perform delete operation as confirmation is required in client application"""

        entry = models.Entry.query.get(id)
        db.session.delete(entry)
        db.session.commit()


api.add_resource(EntryList, '/entries')
api.add_resource(Entry, '/entries/<int:id>')
