import { useCallback, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import { useStore } from '../components/Store';

export function useInput(defaultValues = {}) {
  const [values, setValues] = useState(defaultValues);
  const handleChange = useCallback(event => {
    const target = event.currentTarget;
    const value = target.multiple
      ? Array.from(target.selectedOptions).map(option => option.value)
      : target.value;
    setValues({ ...values, [target.name]: value });
  }, [values, setValues]);
  return [values, handleChange, setValues];
}

export function useAuthentication() {
  const [user] = useStore(state => state.user);
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/');
    }
  }, [user, history]);
}

export function useAuthorization({ role } = {}) {
  const [user] = useStore(state => state.user);
  const history = useHistory();

  useEffect(() => {
    if (user && !user.roles.includes(role)) {
      history.push('/portal');
    }
  }, [user, history, role]);
}
