import React from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";

import Login from '../Login';
import Portal from '../Portal';

export default function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/portal">
          <Portal />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </HashRouter>
  );
}
