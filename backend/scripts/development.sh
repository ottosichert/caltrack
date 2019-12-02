#!/bin/bash
export FLASK_APP=caltrack
export FLASK_ENV=development
flask "${@:-run}"
