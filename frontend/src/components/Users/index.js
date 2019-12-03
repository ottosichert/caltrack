import React, { useEffect, useState } from 'react';

import { get } from '../../utils/functions';

export default function Users() {
  const [users, setUsers] = useState(null);
  const [version, setVersion] = useState(0);
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

  return (
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
            <td colSpan={4}>{error || 'Loading users...'}</td>
          </tr>
        )}
        {users && users.map(user => (
          <tr>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.roles.join(', ')}</td>
            <td>Actions</td>
          </tr>
        ))}
      </tbody>
    </table>

  );
}
