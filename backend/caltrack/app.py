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

        from . import db, models, api, cli  # noqa: F401

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def index(path=None):
        """Catch-all route to let SPA handle routing"""

        return render_template(f'{os.environ["FLASK_ENV"]}.html')

    return app
