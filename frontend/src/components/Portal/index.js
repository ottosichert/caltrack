import React, { Fragment } from 'react';
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Menu from '../Menu';

export default function Portal() {
  const match = useRouteMatch();

  return (
    <Fragment>
      <Menu />
      <Switch>
        <Route path={`${match.path}/settings`}>
          <h1 className="title">Settings</h1>
        </Route>
        <Route path={match.path}>
          <h1 className="title">Dashboard</h1>
        </Route>
      </Switch>
    </Fragment>
  );
}
