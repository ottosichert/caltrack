def test_password_change(client, login):
    """Logging in after password was changed"""

    models = client.application.extensions['models']
    db = client.application.extensions['db']
    user = models.User(username='change_user', password='change_user')
    db.session.add(user)
    db.session.commit()

    with login(user):
        response = client.patch('/api/profile', json={
            'old_password': 'change_user',
            'new_password': 'foo',
            'daily_calories': user.daily_calories,
        })
        assert response.status_code == 200

        client.post('/api/auth/login', json={
            'username': 'change_user',
            'password': 'foo',
        })
        assert response.status_code == 200


def test_password_duplicate(client, login):
    """Prevent changing to the same password"""

    models = client.application.extensions['models']
    db = client.application.extensions['db']
    user = models.User(username='password_user', password='password_user')
    db.session.add(user)
    db.session.commit()

    with login(user):
        response = client.patch('/api/profile', json={
            'old_password': 'password_user',
            'new_password': 'password_user',
            'daily_calories': user.daily_calories,
        })
        assert response.status_code == 400
