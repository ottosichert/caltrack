from datetime import timezone

import dateutil.parser
from flask import current_app, g
from flask_restful import Resource, fields, marshal_with, reqparse

db = current_app.extensions['db']
models = current_app.extensions['models']
api = current_app.extensions['api']
auth = current_app.extensions['auth']


class UtcDateTime(fields.DateTime):
    def format(self, value):
        return super(UtcDateTime, self).format(value.replace(tzinfo=timezone.utc))


def to_datetime(value):
    return dateutil.parser.parse(value)


def to_time(value):
    return dateutil.parser.parse(value).time()


entry_fields = {
    'id': fields.Integer,
    'label': fields.String,
    'datetime': UtcDateTime(dt_format='iso8601'),
    'calories': fields.Integer,
}

entry_parser = reqparse.RequestParser()
entry_parser.add_argument('label', type=str, required=True)
entry_parser.add_argument('calories', type=int, required=True)
entry_parser.add_argument('datetime', type=to_datetime, required=True)

filter_parser = reqparse.RequestParser()
filter_parser.add_argument('from_date', type=to_datetime, location='args')
filter_parser.add_argument('to_date', type=to_datetime, location='args')
filter_parser.add_argument('to_time', type=to_time, location='args')
filter_parser.add_argument('from_time', type=to_time, location='args')
filter_parser.add_argument('timezone_offset', type=int, location='args', default=0)


class EntryList(Resource):
    @marshal_with(entry_fields)
    @auth.login_required
    def get(self):
        args = filter_parser.parse_args()
        query = models.Entry.query.filter_by(user=g.user)

        if args['from_date']:
            query = query.filter(models.Entry.datetime >= args['from_date'])
        if args['to_date']:
            query = query.filter(models.Entry.datetime <= args['to_date'])
        if args['from_time']:
            query = query.filter(
                db.func.time(models.Entry.datetime, f"{-args['timezone_offset']} minutes") >= str(args['from_time'])
            )
        if args['to_time']:
            query = query.filter(
                db.func.time(models.Entry.datetime, f"{-args['timezone_offset']} minutes") <= str(args['to_time'])
            )

        return query.all()

    @marshal_with(entry_fields)
    @auth.login_required
    def post(self):
        args = entry_parser.parse_args(strict=True)
        entry = models.Entry(**args)
        entry.user = g.user
        db.session.add(entry)
        db.session.commit()
        current_app.logger.debug(f'Created {entry}')
        return entry


class Entry(Resource):
    @marshal_with(entry_fields)
    @auth.ownership_required(models.Entry)
    def patch(self, id=None):
        args = entry_parser.parse_args(strict=True)
        entry = models.Entry.query.get(id)
        for key, value in args.items():
            setattr(entry, key, value)
        db.session.commit()
        return entry

    @marshal_with(entry_fields)
    @auth.ownership_required(models.Entry)
    def delete(self, id=None):
        entry = models.Entry.query.get(id)
        db.session.delete(entry)
        db.session.commit()


api.add_resource(EntryList, '/entries')
api.add_resource(Entry, '/entries/<int:id>')
