import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from '../Login';
import Portal from '../Portal';
import Store from '../Store';

export default function App() {
  return (
    <Store>
      <BrowserRouter>
        <Switch>
          <Route path="/portal">
            <Portal />
          </Route>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </BrowserRouter>
    </Store>
  );
}
