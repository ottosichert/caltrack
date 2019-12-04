from flask import current_app
from flask_restful import Resource, abort, fields, marshal_with, reqparse
from sqlalchemy.exc import IntegrityError

db = current_app.extensions['db']
models = current_app.extensions['models']
api = current_app.extensions['api']
auth = current_app.extensions['auth']

role_fields = {
    'id': fields.Integer,
    'name': fields.String,
}

user_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'roles': fields.List(fields.String(attribute='name')),
}

user_parser = reqparse.RequestParser()
user_parser.add_argument('username', type=str, required=True)
user_parser.add_argument('password', type=str, required=True)
user_parser.add_argument(
    'role_ids',
    type=lambda value: models.Role.query.get(value),
    action='append',
    default=[],
    dest='roles'
)


class UserList(Resource):
    @marshal_with(user_fields)
    @auth.roles_required("Manager")
    def get(self):
        return models.User.query.all()

    @marshal_with(user_fields)
    @auth.roles_required("Manager")
    def post(self):
        args = user_parser.parse_args(strict=True)
        user = models.User(**args)
        db.session.add(user)
        try:
            db.session.commit()
            current_app.logger.debug(f'Created {user}')
            return user
        except IntegrityError:  # duplicate username
            db.session.rollback()
            current_app.logger.info(f'Attempt to create duplicate {user}')
            return abort(403)


class RoleList(Resource):
    @marshal_with(role_fields)
    @auth.roles_required("Manager")
    def get(self):
        return models.Role.query.all()


api.add_resource(UserList, '/users')
api.add_resource(RoleList, '/roles')
