import React, { Fragment, useEffect, useState } from 'react';

import { get, post } from '../../utils/functions';
import { useInput, useAuthorization } from '../../utils/hooks';

export default function Users() {
  const [values, handleChange, setValues] = useInput();
  const [users, setUsers] = useState(null);
  const [roles, setRoles] = useState(null);
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useAuthorization({ role: 'Manager' });

  const usersEndpoint = '/api/users';
  const rolesEndpoint = '/api/roles';

  // load users
  useEffect(() => {
    (async () => {
      const response = await get(usersEndpoint);
      if (!response.ok) {
        return setError('Error while loading users! Please reload page.');
      }
      const users = await response.json();
      setUsers(users);
    })();
  }, [version]);

  // load roles
  useEffect(() => {
    (async () => {
      setLoading(true);
      const response = await get(rolesEndpoint);
      if (!response.ok) {
        return setError('Error while loading roles! Please reload page.');
      }
      const roles = await response.json();
      setRoles(roles);
      setLoading(false);
    })();
  }, []);

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const response = await post(usersEndpoint, { body: JSON.stringify(values) });
    setLoading(false);
    if (!response.ok) {
      return setError('Error while creating user!');
    }
    setVersion(version + 1);
    setValues({});
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

      <form className="pure-form form" method="post" action={usersEndpoint} onSubmit={handleSubmit}>
        <fieldset className="pure-group" disabled={loading}>
          <legend>New user</legend>

          <input
            className="pure-input-1"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            value={values.username || ""}
          />
          <input
            className="pure-input-1"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            type="password"
            required
            value={values.password || ""}
          />
          <select
            className="pure-input-1"
            name="role_ids"
            multiple
            onChange={handleChange}
            disabled={loading}
            value={values.role_ids || []}
          >
            {roles === null && (
              <option>Loading roles...</option>
            )}
            {roles && roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </fieldset>

        <button className="pure-button pure-button-primary pure-input-1" type="submit">Create</button>
        <span className="pure-form-message error">{error || "\u00a0"}</span>
      </form>
    </Fragment>
  );
}
