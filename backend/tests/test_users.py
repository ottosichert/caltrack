def test_users_user(client, login):
    """Prevent user from modifying permissions"""

    models = client.application.extensions['models']
    user = models.User.query.filter_by(username='user').one()
    role = models.Role.query.filter_by(name='Manager').one()

    with login(user):
        response = client.patch(f'/api/users/{user.id}', json={
            'username': user.username,
            'role_ids': [role.id],
        })
        assert response.status_code == 403
        assert len(user.roles) == 0


def test_users_admin(client, login):
    """Allow modifying users as admin"""

    models = client.application.extensions['models']
    db = client.application.extensions['db']
    user = models.User.query.filter_by(username='user').one()
    role = models.Role.query.filter_by(name='Manager').one()

    with login(username='admin'):
        response = client.patch(f'/api/users/{user.id}', json={
            'username': user.username,
            'role_ids': [role.id],
        })
        assert response.status_code == 200
        assert len(user.roles) == 1

        user.roles.pop()
        db.session.commit()
        assert len(user.roles) == 0
