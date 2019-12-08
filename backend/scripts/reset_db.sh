#!/bin/bash
source `which virtualenvwrapper.sh`
workon caltrack

rm -f `dirname $0`/../instance/$1.sqlite
flask db upgrade
flask caltrack fixtures caltrack/fixtures/*

deactivate
