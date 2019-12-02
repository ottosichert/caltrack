#!/bin/bash
export FLASK_APP=caltrack
export FLASK_ENV=development
export APP_ENV=development
flask "${@:-run}"
