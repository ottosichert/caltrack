import React, { Fragment, useEffect, useState } from 'react';

import { get, post } from '../../utils/functions';
import { useInput } from '../../utils/hooks';

export default function Users() {
  const [values, handleChange] = useInput();
  const [users, setUsers] = useState(null);
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const response = await get('/api/users');
      if (!response.ok) {
        return setError('Error while loading users! Please reload page.');
      }
      const users = await response.json();
      setUsers(users);
    })();
  }, [version]);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    const response = post('/api/users', { body: JSON.stringify(values) });
    setLoading(false);
    if (!response.ok) {
      return setError('Error while creating user!');
    }
  };

  return (
    <Fragment>
      <table className="pure-table pure-table-striped table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Roles</th>
            <th>&nbsp;</th>
          </tr>
        </thead>

        <tbody>
          {users === null && (
            <tr>
              <td colSpan={4}>Loading users...</td>
            </tr>
          )}
          {users && users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.roles.join(', ')}</td>
              <td>Actions</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form className="pure-form form" method="post" action="/api/users" onSubmit={handleSubmit}>
        <fieldset className="pure-group" disabled={loading}>
          <legend>Create user</legend>

          <input
            className="pure-input-1"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            className="pure-input-1"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            type="password"
            required
          />
          <button className="pure-button pure-button-primary pure-input-1" type="submit">Create</button>
        </fieldset>

        <span className="pure-form-message error">{error || "\u00a0"}</span>
      </form>
    </Fragment>
  );
}
