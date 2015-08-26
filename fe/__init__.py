from flask import Flask, g, current_app, session
from . import views
from wb_api import WBAPI


def get_api_before_request():
    g.wb_api = WBAPI(current_app.config["API_URI"])
    try:
        g.wb_api.set_session_cookies(session["api_cookies"])
    except KeyError:
        pass


def create_app(config_object=None):
    app = Flask(__name__)

    app.config.from_object('config.default')
    if config_object:
        app.config.from_object(config_object)

    app.add_url_rule('/', view_func=views.get_apps, methods=['GET'])
    app.add_url_rule('/login', view_func=views.get_login, methods=['GET'])
    app.add_url_rule('/login', view_func=views.do_login, methods=['POST'])
    app.add_url_rule('/logout', view_func=views.do_logout, methods=['GET'])
    app.add_url_rule('/deploy', view_func=views.do_deploy, methods=['POST'])
    app.before_request(get_api_before_request)

    return app
