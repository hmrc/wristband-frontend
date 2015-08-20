#!/usr/bin/env python

from fe import create_app

if __name__ == '__main__':
    app = create_app()
    app = create_app('config.development')
    app.run(debug=True)
else:
    app = create_app()
