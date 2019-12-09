from contextlib import contextmanager

import pytest

from caltrack import create_app

app = create_app()


@pytest.fixture
def client():
    with app.app_context():
        yield app.test_client()


@pytest.fixture
def login(client):
    @contextmanager
    def context(user=None, username=None):
        if not user:
            user = client.application.extensions['models'].User.query.filter_by(username=username).one()
        with client.session_transaction() as session:
            session['user_id'] = user.id
        yield
    return context
