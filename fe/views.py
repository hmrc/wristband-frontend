__all__ = [
    "get_login",
    "do_login",
    "do_logout",
    "get_apps",
    "do_deploy",
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
    return render_template('login.html', error=error)


def do_login():
    session.clear()
    try:
        g.wb_api.login(**request.form)
    except WBAPIUnauthorizedError:
        return redirect(url_for('get_login', error="bad_login"))
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
                        username=session["username"]), headers=headers)


def do_deploy():
    app = request.form["app"]
    stage = request.form["stage"]
    version = request.form["version"]

    try:
        g.wb_api.deploy_app(app, stage, version)
    except WBAPIUnauthorizedError:
        return redirect(url_for('do_logout'))

    return redirect(url_for('get_apps'))
