import os

from .keys import get_secret_key


class BaseConfig:
    FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
    APP_ENV = os.environ.get('APP_ENV', FLASK_ENV)
    SECRET_KEY_PATH = 'SECRET_KEY'
    SECRET_KEY = get_secret_key(SECRET_KEY_PATH)
    SESSION_COOKIE_SAMESITE = 'strict'
