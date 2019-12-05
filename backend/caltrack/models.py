from datetime import datetime
import sys

from flask import current_app
from werkzeug.security import check_password_hash, generate_password_hash

db = current_app.extensions['db']


class Opaque:
    def __init__(self, model, attribute, validator):
        self.model = model
        self.attribute = attribute
        self.validator = validator

    def __eq__(self, other):
        return self.validator(getattr(self.model, self.attribute), other)

    def __ne__(self, other):
        return not self.__eq__(other)


user_roles = db.Table(
    'user_roles',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('role_id', db.Integer, db.ForeignKey('role.id'), primary_key=True)
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    daily_calories = db.Column(db.Integer, server_default="2000", nullable=False)

    meals = db.relationship('Entry', backref='user', lazy=True)
    roles = db.relationship('Role', secondary=user_roles, lazy='subquery', backref=db.backref('users', lazy=True))

    def __init__(self, *args, password=None, **kwargs):
        if password:
            self.password = password
        super(User, self).__init__(*args, **kwargs)

    def __repr__(self):
        return f'User(id={self.id}, username="{self.username}")'

    def has_role(self, role_name):
        for role in self.roles:
            if role.name == role_name:
                return True
        return False

    @property
    def password(self):
        return Opaque(self, 'password_hash', check_password_hash)

    @password.setter
    def password(self, value):
        self.password_hash = generate_password_hash(value)


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), index=True, unique=True, nullable=False)

    def __repr__(self):
        return f'Role(id={self.id}, name="{self.name}")'


class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    label = db.Column(db.String(255), index=True, nullable=False)
    calories = db.Column(db.Integer, nullable=False)
    datetime = db.Column(db.DateTime, index=True, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f'Entry(id={self.id}, user_id={self.user_id}, label="{self.label}", calories={self.calories})'


current_app.extensions['models'] = sys.modules[__name__]
