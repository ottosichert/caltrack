# _CalTrack_

A simple web app for tracking calories consumption implemented using Flask and React.

by Otto Sichert (mail@ottosichert.de)

## Technologies

This web app is split into a REST backend using Flask (https://flask.palletsprojects.com/en/1.1.x/) in Python and React (https://reactjs.org/) in JavaScript.

### Backend

Code is located at `backend/` and dependencies are in `backend/requirements.txt`. You can use `virtualenvwrapper` (https://virtualenvwrapper.readthedocs.io/) to create a custom environment for this project. `python` version has to be at least `3.6`.


```
backend/ $ mkvirtualenv caltrack -a . -p /usr/bin/python3.6 -r requirements.txt
(caltrack) backend/ $ ./scripts/development.sh
```

### Frontend

Code is located at `frontend/` and dependencies are in `frontend/package.json`. You can use `yarn` (https://yarnpkg.com/) to install dependencies. `node` version has to be at least `10`.

```
frontend/ $ yarn
frontend/ $ yarn start
```
