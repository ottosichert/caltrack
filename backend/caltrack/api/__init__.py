from flask import current_app
from flask_restful import Api

current_app.extensions['api'] = Api(current_app, prefix='/api')

from . import auth  # noqa: E402 F401
