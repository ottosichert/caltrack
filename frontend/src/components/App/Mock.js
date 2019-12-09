import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from "react-router-dom";

import { StoreContext } from '../Store';

export default function AppMock({
  state = {},
  dispatch = () => {},
  children,
  history = createMemoryHistory()
} = {}) {
  return (
    <Router history={history}>
      <StoreContext.Provider value={[state, dispatch]}>
        {children}
      </StoreContext.Provider>
    </Router>
  )
}
