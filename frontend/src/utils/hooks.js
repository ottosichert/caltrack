import queryString from 'query-string';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import { get} from './functions';
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

export function useResource(endpoint, dependencies = [], filters = null) {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(
    () => {
      setLoading(true);
      setError(null);
      setResource(null);
      (async () => {
        const response = await get(`${endpoint}${filters ? `?${queryString.stringify(filters)}` : ''}`);
        setLoading(false);
        if (!response.ok) {
          return setError(`Error while loading ${endpoint.split('/').slice(-1)[0]}! Please reload page.`);
        }
        const data = await response.json();
        setResource(data);
      })();
    }, [
      endpoint,
      filters,
      ...dependencies, // eslint-disable-line react-hooks/exhaustive-deps
    ]);

  return [resource, loading, error];
}
