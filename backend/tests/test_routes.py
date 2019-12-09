frontend_script = b'<script src="/static/caltrack.js"></script>'
frontend_node = b'<div id="app" class="app" />'
frontend_pure = b'<link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css">'
frontend_styles = b'<link rel="stylesheet" href="/static/caltrack.css">'


def test_index(client):
    """Single page application entry point is loaded correctly from index"""

    response = client.get('/')
    assert frontend_script in response.data
    assert frontend_node in response.data
    assert frontend_pure in response.data
    assert frontend_styles in response.data


def test_routes(client):
    """Single page application entry point is loaded correctly from sub pages"""

    response = client.get('/portal')
    assert frontend_script in response.data
    assert frontend_node in response.data
    assert frontend_pure in response.data
    assert frontend_styles in response.data

    response = client.get('/portal/users?with=parameters')
    assert frontend_script in response.data
    assert frontend_node in response.data
    assert frontend_pure in response.data
    assert frontend_styles in response.data

    response = client.get('/route_not_found')
    assert frontend_script in response.data
    assert frontend_node in response.data
    assert frontend_pure in response.data
    assert frontend_styles in response.data

    response = client.get('/api/not_found')
    assert frontend_script in response.data
    assert frontend_node in response.data
    assert frontend_pure in response.data
    assert frontend_styles in response.data


def test_api(client):
    """Single page application entry point is not loaded from API endpoints"""

    response = client.get('/api/users')
    assert frontend_script not in response.data
    assert frontend_node not in response.data
    assert frontend_pure not in response.data
    assert frontend_styles not in response.data

    response = client.get('/api/profile?with=parameters')
    assert frontend_script not in response.data
    assert frontend_node not in response.data
    assert frontend_pure not in response.data
    assert frontend_styles not in response.data
