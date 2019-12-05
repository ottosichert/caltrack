import React, { Fragment, useCallback, useState } from 'react';

import Edit from './Edit';
import { delete_ } from '../../utils/functions';
import { useAuthorization, useResource } from '../../utils/hooks';

export default function Users() {
  const [version, setVersion] = useState(0);
  const [user, setUser] = useState(null);

  useAuthorization({ role: 'Manager' });

  const endpoint = '/api/users';
  const [users, usersLoading, usersError] = useResource(endpoint, [version]);

  const resetUser = useCallback(() => setUser(null), [setUser]);
  const incrementVersion = useCallback(() => setVersion(version + 1), [setVersion, version]);
  const handleEdit = user => event => setUser(user);
  const handleDelete = user => async event => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Do you really want to delete user "${user.username}" and all related data?\n\nThis action cannot be undone.`)) {
      await delete_(`${endpoint}/${user.id}`);
      incrementVersion();
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
          {usersLoading && (
            <tr>
              <td colSpan={4}>Loading users...</td>
            </tr>
          )}
          {users && users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.roles.map(role => role.name).join(', ')}</td>
              <td>
                <div className="pure-button-group">
                  <button className="pure-button pure-button-primary" onClick={handleEdit(user)}>Edit</button>
                  <button className="pure-button" onClick={handleDelete(user)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
          {usersError && (
            <tr>
              <td colSpan={4}>{usersError}</td>
            </tr>
          )}
        </tbody>
      </table>

      <Edit endpoint={endpoint} resource={user} reset={resetUser} save={incrementVersion} />
    </Fragment>
  );
}
