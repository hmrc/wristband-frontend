__all__ = [
    "get_apps"
    "do_deploy"
]

from flask import render_template, request, redirect, url_for, abort

apps = {
    "test": {
        "stage": {
            "qa": {
                "version": "0.0.2",
            },
            "staging": {
                "version": "0.0.1",
            }
        }
    }
}

_deploying_apps = {
}


def get_apps():
    return render_template(
        'index.html',
        apps=[dict({"name": app_name}.items() + app_details.items()) for app_name, app_details in apps.items()])


def do_deploy():
    app = request.form["app"]
    version = request.form["version"]
    stage = request.form["stage"]
    apps[app]["stage"][stage]["version"] = version
    return redirect(url_for('get_apps'))
