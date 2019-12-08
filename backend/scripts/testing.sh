#!/bin/bash
source `which virtualenvwrapper.sh`
workon caltrack

export FLASK_APP=caltrack
export FLASK_ENV=production
export APP_ENV=testing
pytest "$@"

deactivate
