import sys

from flask import current_app

db = current_app.extensions['db']


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

    roles = db.relationship('Role', secondary=user_roles, lazy='subquery', backref=db.backref('users', lazy=True))

    def __repr__(self):
        return f'User(id={self.id}, username="{self.username}")'


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), index=True, unique=True, nullable=False)

    def __repr__(self):
        return f'Role(id={self.id}, name="{self.name}")'


current_app.extensions['models'] = sys.modules[__name__]
