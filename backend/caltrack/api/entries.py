from datetime import datetime, timezone

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


entry_fields = {
    'id': fields.Integer,
    'label': fields.String,
    'datetime': UtcDateTime(dt_format='iso8601'),
    'calories': fields.Integer,
}

entry_parser = reqparse.RequestParser()
entry_parser.add_argument('label', type=str, required=True)
entry_parser.add_argument('calories', type=int, required=True)
entry_parser.add_argument(
    'datetime',
    type=lambda value: dateutil.parser.parse(value),
    default=datetime.utcnow,
)


class EntryList(Resource):
    @marshal_with(entry_fields)
    @auth.login_required
    def get(self):
        return models.Entry.query.filter_by(user=g.user).all()

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


api.add_resource(EntryList, '/entries')
