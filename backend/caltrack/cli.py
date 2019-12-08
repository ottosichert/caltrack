import click
from flask import current_app
from flask.cli import AppGroup
from flask_fixtures import setup

db = current_app.extensions['db']
models = current_app.extensions['models']
cli = AppGroup('caltrack', help='Management commands to create users and roles')


@cli.command('role')
@click.argument('name')
def create_role(name):
    """Create a role by name (without any checks)"""

    role = models.Role(name=name)
    db.session.add(role)
    db.session.commit()


@cli.command('user')
@click.argument('username')
@click.option('--password', prompt=True, hide_input=True)
@click.argument('roles', nargs=-1)
def create_user(username, password, roles):
    """Create a user with roles by name (without any checks)"""

    user = models.User(username=username, password=password)
    for role in roles:
        user.roles.append(models.Role.query.filter_by(name=role).one())
    db.session.add(user)
    db.session.commit()


@cli.command('fixtures')
@click.argument('files', nargs=-1)
def load_fixtures(files):
    """Load fixtures for integration tests"""

    class Fixture:
        app = current_app
        db = db
        fixtures = files

    setup(Fixture)


current_app.cli.add_command(cli)
