import React, { Fragment, useState } from 'react';

import { post } from '../../utils/functions';
import { useInput, useAuthorization, useResource } from '../../utils/hooks';

export default function Users() {
  const [values, handleChange, setValues] = useInput();
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useAuthorization({ role: 'Manager' });

  const endpoint = '/api/users';
  const [users, usersLoading, usersError] = useResource(endpoint, [version]);
  const [roles, rolesLoading, rolesError] = useResource('/api/roles', [version]);

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const response = await post(endpoint, { body: JSON.stringify(values) });
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
          {usersLoading && (
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
          {usersError && (
            <tr>
              <td colSpan={4}>{usersError}</td>
            </tr>
          )}
        </tbody>
      </table>

      <form className="pure-form form" method="post" action={endpoint} onSubmit={handleSubmit}>
        <fieldset className="pure-group" disabled={loading || rolesLoading || rolesError}>
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
            disabled={loading || rolesLoading || rolesError}
            value={values.role_ids || []}
          >
            {rolesLoading && (
              <option>Loading roles...</option>
            )}
            {roles && roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </fieldset>

        <button className="pure-button pure-button-primary pure-input-1" type="submit">Create</button>
        <span className="pure-form-message error">{error || rolesError || "\u00a0"}</span>
      </form>
    </Fragment>
  );
}
