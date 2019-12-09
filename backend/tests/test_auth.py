from flask import session


def test_register_new(client):
    """Registration creates new user entry"""

    response = client.post('/api/auth/register', json={
        'username': 'new_user',
        'password': 'new_user',
    })
    assert response.status_code == 200

    json = response.get_json()
    assert json.get('username') == 'new_user'

    models = client.application.extensions['models']
    assert models.User.query.filter_by(username='new_user').count() == 1


def test_register_duplicate(client):
    """Registration fails if user already exists"""

    models = client.application.extensions['models']
    db = client.application.extensions['db']
    db.session.add(models.User(username='duplicate_user', password='duplicate_user'))
    db.session.commit()
    assert models.User.query.filter_by(username='duplicate_user').count() == 1

    response = client.post('/api/auth/register', json={
        'username': 'duplicate_user',
        'password': 'duplicate_user',
    })
    assert response.status_code == 403
    assert models.User.query.filter_by(username='duplicate_user').count() == 1


def test_login(client):
    """Logging in as existing user works"""

    models = client.application.extensions['models']
    db = client.application.extensions['db']
    user = models.User(username='login_user', password='login_user')
    db.session.add(user)
    db.session.commit()

    with client:
        response = client.post('/api/auth/login', json={
            'username': 'login_user',
            'password': 'login_user',
        })
        assert response.status_code == 200
        assert session['user_id'] == user.id
