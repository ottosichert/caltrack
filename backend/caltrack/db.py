from flask import current_app
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy


db = current_app.extensions['db'] = SQLAlchemy(current_app)
Migrate(current_app, db)
