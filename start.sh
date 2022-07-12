#!/bin/sh

export FLASK_APP=app.py

# for dev
export FLASK_ENV=development

python3 -m flask run --host=0.0.0.0