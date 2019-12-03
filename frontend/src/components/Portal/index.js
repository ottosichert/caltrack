import React, { Fragment } from 'react';
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Menu from '../Menu';
import Profile from '../Profile';

export default function Portal() {
  const match = useRouteMatch();

  return (
    <Fragment>
      <Menu />

      <Switch>
        <Route path={`${match.path}/profile`}>
          <Profile />
        </Route>
        <Route path={match.path}>
          <h1 className="title">Dashboard</h1>
        </Route>
      </Switch>
    </Fragment>
  );
}
