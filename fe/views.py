__all__ = [
    "get_apps"
    "do_deploy"
]

from flask import render_template, request, redirect, url_for, abort
from flask import session, current_app
import requests


def get_login():
    error=request.args.get('error', None)
    return render_template('login.html', error=error)


def do_login():
    # POST to the API/login with the username and password for validation
    # expect back an access token to be stored in a session for use in future API calls
    if "fakeauth" in session:
        return redirect(url_for('get_apps'))
    session.clear()
    r = requests.post("{}login/".format(current_app.config["API_URI"]), request.form)
    try:
        r.raise_for_status()
    except requests.HTTPError as e:
        if e.response.status_code == 401:
            return redirect(url_for('get_login', error="bad_login"))
    session["username"] = request.form["username"]
    session["fakeauth"] = r.content
    return redirect(url_for('get_apps'))

def do_logout():
    session.clear()
    return redirect(url_for('get_login'))


def get_apps():
    fake_auth_header = session.get("fakeauth", None)
    headers = {"fakeauth": fake_auth_header} if fake_auth_header else {}
    try:
        r = requests.get("{}apps/".format(current_app.config["API_URI"]), headers=headers)
        r.raise_for_status()
        apps = r.json()
        apps = [
            dict(a.items() + {"stages": {s["name"]: s for s in a["stages"]}}.items())
            for a in apps
        ]
    except requests.HTTPError as e:
        if e.response.status_code == 401:
            return redirect(url_for('do_logout'))
    return render_template(
        'index.html',
        apps=apps, username=session["username"])


def do_deploy():
    app = request.form["app"]
    stage = request.form["stage"]
    version = request.form["version"]

    fake_auth_header = session.get("fakeauth", None)
    headers = {"fakeauth": fake_auth_header} if fake_auth_header else {}

    r = requests.put("{}apps/{}/stages/{}/version/{}".format(current_app.config["API_URI"], app, stage, version), headers=headers)
    r.raise_for_status()

    return redirect(url_for('get_apps'))
