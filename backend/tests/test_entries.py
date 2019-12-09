def test_entries_user(client, login):
    """Prevent trying to create entries as different user"""

    models = client.application.extensions['models']
    user = models.User.query.filter_by(username='user').one()
    other_user = models.User.query.filter_by(username='manager').one()

    with login(user):
        response = client.post('/api/entries', json={
            'label': 'Snickers',
            'calories': 300,
            'user_id': other_user.id,
        })
        assert response.status_code == 200

        entry = models.Entry.query.get(response.get_json()['id'])
        assert entry.user == user


def test_entries_admin(client, login):
    """Allow creating entries for different users"""

    models = client.application.extensions['models']
    other_user = models.User.query.filter_by(username='user').one()

    with login(username='admin'):
        response = client.post('/api/entries', json={
            'label': 'Snickers',
            'calories': 300,
            'user_id': other_user.id,
        })
        assert response.status_code == 200

        entry = models.Entry.query.get(response.get_json()['id'])
        assert entry.user == other_user
