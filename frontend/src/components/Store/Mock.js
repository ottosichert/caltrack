import React from 'react';

import { useStore, StoreContext } from '.';

export default function StoreMock({
  state = {},
  dispatch = () => {},
  children,
} = {}) {
  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {children}
    </StoreContext.Provider>
  );
}

export function StoreConsumer({ inspection = {} } = {}) {
  const [state, dispatch] = useStore();
  inspection.dispatch = dispatch;
  return JSON.stringify(state);
}
