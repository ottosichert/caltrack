import React, { useContext, useEffect, useReducer } from 'react';

export const StoreContext = React.createContext({});

// conveniently provide state with optional selector
export const useStore = (selector = state => state) => {
  const [state, dispatch] = useContext(StoreContext);
  return [selector(state), dispatch];
};

// root reducer of the global app state
const reducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return { user: action.payload };

    case 'logout':
      return { user: null };

    default:
      throw new Error();
  }
}

// persistence layer is using `localStorage`
const STORAGE_KEY = 'caltrack';
const initialState = { user: null };
const getInitialState = persisted => persisted ? JSON.parse(persisted) : initialState;

// hydrate store from `localStorage` if available
export default function Store(props) {
  const [state, dispatch] = useReducer(reducer, localStorage.getItem(STORAGE_KEY), getInitialState);

  // persist store on any dispatch
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      {props.children}
    </StoreContext.Provider>
  )
}
