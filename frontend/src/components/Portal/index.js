import React, { Fragment } from 'react';
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Meals from '../Meals';
import Menu from '../Menu';
import Profile from '../Profile';
import Users from '../Users';
import { useAuthentication } from '../../utils/hooks';

export default function Portal() {
  const match = useRouteMatch();

  useAuthentication('/');

  return (
    <Fragment>
      <Menu />

      <Switch>
        <Route path={`${match.path}/profile`}>
          <Profile />
        </Route>
        <Route path={`${match.path}/users`}>
          <Users />
        </Route>
        <Route path={match.path}>
          <Meals />
        </Route>
      </Switch>
    </Fragment>
  );
}
