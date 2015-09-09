#!/usr/bin/env bash
virtualenv env
. env/bin/activate
pip install -r requirements-tests.txt
nosetests -c --with-coverage --cover-package=fe,wb_api tests
deactivate
rm -rf env
