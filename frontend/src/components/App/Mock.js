import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from "react-router-dom";

import StoreMock from '../Store/Mock';

export default function AppMock({
  children,
  history = createMemoryHistory(),
  ...props
} = {}) {
  return (
    <Router history={history}>
      <StoreMock {...props}>
        {children}
      </StoreMock>
    </Router>
  )
}
