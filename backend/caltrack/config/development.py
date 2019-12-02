from flask import current_app

from .base import BaseConfig


class Config(BaseConfig):
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{current_app.instance_path}/caltrack.sqlite'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True
