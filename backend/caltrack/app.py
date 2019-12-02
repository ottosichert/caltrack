import os

from flask import Flask, render_template


def create_app(config=None):
    app = Flask(__name__, instance_relative_config=True)

    # ensure the instance folder exists
    if not os.path.isdir(app.instance_path):
        os.makedirs(app.instance_path)

    app.config.from_object(config)

    @app.route('/')
    def index():
        return render_template(f'{os.environ["FLASK_ENV"]}.html')

    return app
