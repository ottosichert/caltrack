import os

from flask import Flask, render_template


def create_app(config=None):
    app = Flask(__name__, instance_relative_config=True)

    # ensure the instance folder exists
    if not os.path.isdir(app.instance_path):
        os.makedirs(app.instance_path)

    with app.app_context():
        # load from environment variables if not overridden
        if not config:
            from .config import Config as config

        app.config.from_object(config)

        from . import db, models, api  # noqa: F401

    @app.route('/')
    def index():
        return render_template(f'{os.environ["FLASK_ENV"]}.html')

    return app
