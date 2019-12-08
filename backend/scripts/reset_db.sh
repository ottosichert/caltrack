#!/bin/bash

rm instance/$1.*
flask db upgrade
flask caltrack fixtures caltrack/fixtures/*
