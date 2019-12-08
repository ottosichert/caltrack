from flask import current_app

from .base import BaseConfig


class Config(BaseConfig):
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{current_app.instance_path}/{BaseConfig.APP_ENV}.sqlite'
    TESTING = True
