__all__ = [
    "get_login",
    "do_login",
    "do_logout",
    "get_apps",
    "do_deploy",
    "error_handler",
]

from flask import render_template, request, redirect, url_for
from flask import session, g
from flask import Response
from wb_api import WBAPIUnauthorizedError
import json


def get_login():
    if "api_cookies" in session:
        return redirect(url_for('get_apps'))
    error = request.args.get('error', None)
    error_message = request.args.get('error_msg', None)
    return render_template('login.html', error=error, error_message=error_message)


def do_login():
    session.clear()
    try:
        g.wb_api.login(**request.form)
    except WBAPIUnauthorizedError as e:
        return redirect(url_for('get_login', error="bad_login",
                                error_msg=e.response.json()["details"]))
    session["username"] = request.form["username"]
    session["api_cookies"] = g.wb_api.get_session_cookies()
    return redirect(url_for('get_apps'))


def do_logout():
    session.clear()
    return redirect(url_for('get_login'))


def get_apps():
    try:
        apps = g.wb_api.get_apps()
    except WBAPIUnauthorizedError:
        return redirect(url_for('do_logout'))

    etag = '"{}"'.format(hash(json.dumps(sorted(apps, key=lambda a: a["name"]), sort_keys=True)))
    headers = {'ETag': etag}
    if request.headers.get('If-None-Match', None) == etag:
        return Response(None, 304, headers=headers)
    else:
        return Response(render_template(
                        'index.html', apps=apps,
                        username=session.get("username", "anonymous")), headers=headers)


def do_deploy():
    app = request.form["app"]
    stage = request.form["stage"]
    version = request.form["version"]

    try:
        g.wb_api.deploy_app(app, stage, version)
    except WBAPIUnauthorizedError:
        return redirect(url_for('do_logout'))

    return redirect(url_for('get_apps'))


def error_handler(e):
    error = {"status": e.response.status_code}
    try:
        error["msg"] = e.response.json()["details"]
    except:
        error["msg"] = e.response.text
    return render_template('error.html', error=error), e.response.status_code
