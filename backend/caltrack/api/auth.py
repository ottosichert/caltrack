import functools
import sys

from flask import current_app, g, session
from flask_restful import Resource, abort, fields, marshal_with, reqparse
from sqlalchemy.exc import IntegrityError

db = current_app.extensions['db']
models = current_app.extensions['models']
api = current_app.extensions['api']

auth_fields = {'username': fields.String}

auth_parser = reqparse.RequestParser()
auth_parser.add_argument('username', type=str, required=True)
auth_parser.add_argument('password', type=str, required=True)


def login_required(func):
    @functools.wraps(func)
    def wrapped_func(*args, **kwargs):
        if g.user is None:
            current_app.logger.info(f'Unauthenticated access attempt')
            return abort(403)
        return func(*args, **kwargs)
    return wrapped_func


def roles_required(*roles):
    def wrapper(func):
        @login_required
        @functools.wraps(func)
        def wrapped_func(*args, **kwargs):
            query = models.Role.query.join(models.User.roles).filter(models.User.id == g.user.id)
            for role in roles:
                if query.filter_by(name=role).count() == 0:
                    current_app.logger.info(f'Unauthorized access attempt')
                    return abort(403)
            return func(*args, **kwargs)
        return wrapped_func
    return wrapper


@current_app.before_request
def load_logged_in_user():
    user_id = session.get(Authentication.USER_SESSION_KEY)

    if user_id is None:
        g.user = None
    else:
        g.user = models.User.query.get(user_id)


class Authentication(Resource):
    USER_SESSION_KEY = 'user_id'

    def register(self):
        args = auth_parser.parse_args(strict=True)
        user = models.User(**args)
        db.session.add(user)

        try:
            db.session.commit()
            current_app.logger.debug(f'Created {user}')
            return self.login()
        except IntegrityError:  # duplicate username
            db.session.rollback()
            current_app.logger.info(f'Attempt to create duplicate {user}')
            return abort(403)

    def login(self):
        args = auth_parser.parse_args(strict=True)
        user = models.User.query.filter_by(username=args['username']).first()

        if not user:
            current_app.logger.info(f'Username {args["username"]} not found')
            return abort(403)
        elif user.password != args['password']:
            current_app.logger.info(f'Invalid password for {user}')
            return abort(403)

        session[self.USER_SESSION_KEY] = user.id
        return user

    @login_required
    def logout(self):
        del session[self.USER_SESSION_KEY]
        return g.user

    @marshal_with(auth_fields)
    def post(self, action):
        return getattr(self, action)()


api.add_resource(
    Authentication,
    '/auth/<any("register","login","logout"):action>',
)

current_app.extensions['auth'] = sys.modules[__name__]
