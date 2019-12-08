import pytest

from caltrack import create_app

app = create_app()


@pytest.fixture
def client():
    return app.test_client()
