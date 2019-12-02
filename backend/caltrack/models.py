import sys

from flask import current_app

db = current_app.extensions['db']


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), index=True, unique=True)
    password_hash = db.Column(db.String(255))

    def __repr__(self):
        return f'User(id={self.id}, username="{self.username}")'


current_app.extensions['models'] = sys.modules[__name__]
