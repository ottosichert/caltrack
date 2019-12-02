import React from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";

import Form from '../Form';
import Portal from '../Portal';

export default function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/portal">
          <Portal />
        </Route>
        <Route path="/">
          <Form />
        </Route>
      </Switch>
    </HashRouter>
  );
}
