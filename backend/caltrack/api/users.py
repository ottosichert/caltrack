from flask import current_app
from flask_restful import Resource, fields, marshal_with, reqparse

db = current_app.extensions['db']
models = current_app.extensions['models']
api = current_app.extensions['api']
auth = current_app.extensions['auth']

user_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'roles': fields.List(fields.String(attribute='name')),
}

user_parser = reqparse.RequestParser()
user_parser.add_argument('username', type=str, required=True)
user_parser.add_argument('password', type=str, required=True)
user_parser.add_argument('roles', type=int, action='append')


class UserList(Resource):
    @marshal_with(user_fields)
    @auth.roles_required("Manager")
    def get(self):
        return models.User.query.all()


api.add_resource(UserList, '/users')
