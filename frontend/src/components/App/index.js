import React from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from '../Login';
import Portal from '../Portal';
import Store from '../Store';

// provide all root components and set initial route entry point
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
