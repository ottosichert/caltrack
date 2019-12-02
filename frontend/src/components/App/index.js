import React from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";

import Form from '../Form';

export default function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/portal">
          <h1 className="title">CalTrack Portal</h1>
        </Route>
        <Route path="/">
          <h1 className="title">CalTrack</h1>
          <Form />
        </Route>
      </Switch>
    </HashRouter>
  );
}
