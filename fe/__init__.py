from flask import Flask
#from flask.ext.socketio import SocketIO
from . import views


def create_app(config_object=None):
    app = Flask(__name__)

    app.config.from_object('config.default')
    if config_object:
        app.config.from_object(config_object)

    app.add_url_rule('/', view_func=views.get_apps, methods=['GET'])
    app.add_url_rule('/login', view_func=views.get_login, methods=['GET'])
    app.add_url_rule('/login', view_func=views.do_login, methods=['POST'])
    app.add_url_rule('/logout', view_func=views.get_login, methods=['GET'])
    app.add_url_rule('/deploy', view_func=views.do_deploy, methods=['POST'])

    #socketio = SocketIO()
    #socketio.init_app(app)

    return app
