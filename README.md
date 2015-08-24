wristband-frontend
==================

A sfrontend client for the Wristband deployment service. Communicates directly with, and is dependent on [Wristband REST API](https://github.com/hmrc/wristband).

README contents:

- [Installation](#installation)
- [Stack](#stack)
- [Routing](#routing)
- [Events (socket.io)](#events-socket-io-)

Installation
------------

- `$ git clone https://github.tools.tax.service.gov.uk/HMRC/wristband-frontend.git`
- `$ cd wristband-frontend`
- `$ pip install -r requirements.txt`
- `$ python wsgi.py`

The app will now be running: [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

Mock
----

The app has a mock API that can be used when running locally. To start the mock:

- `$ cd mock`
- `$ npm install`
- `$ npm start`

Tests
-----

A set of Jasmine tests exist in the `/test` directory. To run the tests:

- `$ cd test`
- `$ npm install`
- `$ npm test`

Stack
-----

The stack has been chosen based on what is familiar and maintainable within the wider team.

The app is Python based, and uses Flask to provide basic routing and templating via Jinja 2.

The frontend is built using [Semantic UI](http://semantic-ui.com), as Semantic provides a rich suite of components that require little additional work.

[DataTables](https://www.datatables.net/) is used to provide the filtering of the deployment table. In the spike, we're only using the search feature of DataTables, but it supports much more - [DataTables options](https://www.datatables.net/manual/options)

Routing
-------

The app contains a few basic routes in `views.py`:

- `GET` [/login](http://127.0.0.1:5000/login) - the login page
- `GET` [/](http://127.0.0.1:5000/) - the deployments page