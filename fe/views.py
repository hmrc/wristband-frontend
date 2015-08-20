__all__ = [
    "index"
]

from flask import render_template

apps = {
    "test": {
        "stage": [
            {
                "stage": "qa",
                "version": "0.0.2",
            }, {
                "stage": "staging",
                "version": "0.0.1",
            }
        ]
    }
}

def index():
    return render_template('index.html', apps=apps)
