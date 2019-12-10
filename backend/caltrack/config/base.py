import os

from .keys import get_secret_key


class BaseConfig:
    """
    This config is assumed to be safe to be used in both development and
    production environments. Hence why no default database connections are
    provided here.
    """

    FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
    APP_ENV = os.environ.get('APP_ENV', FLASK_ENV)
    SECRET_KEY_PATH = f'{APP_ENV}.key'
    SECRET_KEY = get_secret_key(SECRET_KEY_PATH)
    SESSION_COOKIE_SAMESITE = 'strict'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
