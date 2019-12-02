import secrets

from flask import current_app


def get_secret_key(secret_key_path):
    """Read or generate new secret key from file"""

    with current_app.open_instance_resource(secret_key_path, 'a+') as secret_key_file:
        secret_key_file.seek(0)
        secret_key = secret_key_file.read()

        if not secret_key:
            current_app.logger.info('Creating local secret key file')
            secret_key = secrets.token_hex(32)
            secret_key_file.write(secret_key)

    return secret_key
