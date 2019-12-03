import sys

from flask import current_app

db = current_app.extensions['db']


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    daily_calories = db.Column(db.Integer, server_default="2000", nullable=False)

    def __repr__(self):
        return f'User(id={self.id}, username="{self.username}")'


current_app.extensions['models'] = sys.modules[__name__]
