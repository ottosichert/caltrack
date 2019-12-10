# _CalTrack_

A simple web app for tracking calories consumption implemented using Flask and React.

by Otto Sichert (mail@ottosichert.de)

## Technologies

This web app is split into a REST backend using `Flask` (https://flask.palletsprojects.com/en/1.1.x/) in Python and `React` (https://reactjs.org/) in JavaScript. For styling, PureCSS (https://purecss.io/) is used.

For unit tests `pytest` (https://docs.pytest.org/) and `jest` (https://jestjs.io/) are used, end-to-end tests are run with `cypress` (https://www.cypress.io/).

_Note: This app has been developed with latest Firefox, other browsers might experience errors due to outdated ECMAScript versions or CSS glitches due to PureCSS._

## Setup

First ensure you have `python3.6` (https://www.python.org/downloads/) or higher and `node 10` (https://nodejs.org/en/download/) or higher installed. Then, checkout the repository:

```
workspace/ $ git clone git@github.com:ottosichert/caltrack.git
workspace/ $ cd caltrack/
```

### Backend

Code is located at `backend/` and dependencies are in `backend/requirements.txt`. For this project `virtualenvwrapper` (https://virtualenvwrapper.readthedocs.io/) is used to create a custom python environment. Followed the installation instructions and run this:


```
caltrack/ $ cd backend/
backend/ $ mkvirtualenv caltrack -a . -p /usr/bin/python3.6 -r requirements.
(caltrack) backend/ $ pip install -e .
(caltrack) backend/ $ deactivate
backend/ $ cd ..
```

### Frontend

Code is located at `frontend/` and dependencies are in `frontend/package.json`. For this project `yarn` (https://yarnpkg.com/) is used to install dependencies and run scripts. `node` version has to be at least `10`.

```
caltrack/ $ cd frontend/
frontend/ $ yarn
frontend/ $ cd ..
```

## Environments

This project provides a `development` environment, two testing environments `unit` and `integration`, and two empty deployment environments `staging` and `production`.

### `development`

Run following commands in two separate terminal windows:

```
caltrack/ $ cd frontend/
frontend/ $ yarn start
```

```
caltrack/ $ cd backend/
backend/ $ FLASK_APP=caltrack FLASK_ENV=development ./scripts/reset_db.sh development
backend/ $ ./scripts/development.sh
```

Then open your browser at `http://localhost:5000/`. You can log in with the credentials `user`/`user`, `manager`/`manager` and `admin`/`admin`.

### `integration`

This environment is later used by `cypress` for the end-to-end tests, although it is not required to be run manually. To see it working, run following commands:

```
caltrack/ $ cd frontend/
frontend/ $ yarn build
frontend/ $ cd ../backend
backend/ $ ./scripts/integration.sh
```

The same credentials as above can be used.

## Testing

There are three types of tests: **frontend unit tests**, **backend functional REST API tests** and **end-to-end tests**.

### Frontend unit tests

```
caltrack/ $ cd frontend/
frontend/ $ yarn test:unit
```

### Backend functional REST API tests

```
caltrack/ $ cd backend/
backend/ $ ./scripts/unit.sh
```

### End-to-end tests

This will launch `cypress` headless:

```
caltrack/ $ cd frontend/
frontend/ $ yarn test:integration
```

To run `cypress` testing IDE, run this and select the desired (or all tests):

```
frontend/ $ yarn test:cypress
```
