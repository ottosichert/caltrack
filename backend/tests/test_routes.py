frontend_script = b'<script src="/static/caltrack.js"></script>'
frontend_node = b'<div id="app" class="app" />'


def test_index(client):
    """Single page application entry point is loaded correctly from index"""

    reponse = client.get('/')
    assert frontend_script in reponse.data
    assert frontend_node in reponse.data


def test_routes(client):
    """Single page application entry point is loaded correctly from sub pages"""

    reponse = client.get('/portal')
    assert frontend_script in reponse.data
    assert frontend_node in reponse.data

    reponse = client.get('/portal/users?with=parameters')
    assert frontend_script in reponse.data
    assert frontend_node in reponse.data

    reponse = client.get('/route_not_found')
    assert frontend_script in reponse.data
    assert frontend_node in reponse.data

    reponse = client.get('/api/not_found')
    assert frontend_script in reponse.data
    assert frontend_node in reponse.data


def test_api(client):
    """Single page application entry point is not loaded from API endpoints"""

    reponse = client.get('/api/users')
    assert frontend_script not in reponse.data
    assert frontend_node not in reponse.data

    reponse = client.get('/api/profile?with=parameters')
    assert frontend_script not in reponse.data
    assert frontend_node not in reponse.data