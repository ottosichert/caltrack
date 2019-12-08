#!/bin/bash
source `which virtualenvwrapper.sh`
workon caltrack

export FLASK_APP=caltrack
export FLASK_ENV=development
export APP_ENV=development
flask "${@:-run}"

deactivate
