from flask import current_app
from flask_restful import Resource, abort, fields, marshal_with, reqparse

db = current_app.extensions['db']
models = current_app.extensions['models']
api = current_app.extensions['api']
auth = current_app.extensions['auth']

profile_fields = {
    'old_password': fields.String,
    'new_password': fields.String,
    'daily_calories': fields.Integer,
}

profile_parser = reqparse.RequestParser()
profile_parser.add_argument('old_password', type=str)
profile_parser.add_argument('new_password', type=str)
profile_parser.add_argument('daily_calories', type=int, required=True)


class Profile(Resource):
    @marshal_with(profile_fields)
    @auth.login_required
    def get(self):
        return auth.get_current_user()

    @marshal_with(profile_fields)
    @auth.login_required
    def patch(self):
        args = profile_parser.parse_args(strict=True)
        user = auth.get_current_user()

        # either both optional or both required
        if bool(args['old_password']) != bool(args['new_password']):
            return abort(400)
        # must be different passwords if new password requested
        elif args['new_password']:
            if args['old_password'] == args['new_password']:
                current_app.logger.info(f'Trying to change to same password for {user}')
                return abort(400)
            elif user.password != args['old_password']:
                current_app.logger.info(f'Invalid password change request for {user}')
                return abort(403)

            user.password = args['new_password']

        user.daily_calories = args['daily_calories']
        db.session.commit()
        return self.get()


api.add_resource(Profile, '/profile')
