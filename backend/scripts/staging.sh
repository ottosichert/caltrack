#!/bin/bash
export FLASK_APP=caltrack
export FLASK_ENV=production
export APP_ENV=staging
flask "${@:-run}"
