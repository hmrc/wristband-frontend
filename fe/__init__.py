from flask import Flask
from . import views


def create_app(config_object=None):
    app = Flask(__name__)

    app.config.from_object('config.default')
    if config_object:
        app.config.from_object(config_object)

    app.add_url_rule('/', view_func=views.index)

    return app
