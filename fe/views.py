__all__ = [
    "index"
]

from flask import render_template

apps = [
    {
        "name": "test",
        "stage": {
            "qa": {
                "version": "0.0.2",
            },
            "staging": {
                "version": "0.0.1",
            }
        }
    }
]

def index():
    return render_template('index.html', apps=apps)
