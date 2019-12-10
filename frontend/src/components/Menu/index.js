import React from 'react';
import { Link, NavLink } from "react-router-dom";

import { useStore } from '../Store';
import { post } from '../../utils/functions';
import { useRole } from '../../utils/hooks';

// menu will be shown in portal area and provides logout functionality
export default function Menu() {
  const [user, dispatch] = useStore(state => state.user);
  const isManager = useRole('Manager');

  const handleClick = async event => {
    event.preventDefault();
    const response = await post('/api/auth/logout');
    if (response.ok) {
      dispatch({ type: 'logout' });
    }
  };

  return (
    <div className="pure-menu pure-menu-horizontal menu">
      <span className="pure-menu-heading brand">CalTrack</span>
      <ul className="pure-menu-list navigation">
        <li className="pure-menu-item">
          <NavLink to="/portal" className="pure-menu-link" activeClassName="pure-menu-selected" exact>Meals</NavLink>
        </li>
        <li className="pure-menu-item">
          <NavLink to="/portal/profile" className="pure-menu-link" activeClassName="pure-menu-selected">Profile</NavLink>
        </li>
        {isManager && (
          <li className="pure-menu-item">
            <NavLink to="/portal/users" className="pure-menu-link" activeClassName="pure-menu-selected">Users</NavLink>
          </li>
        )}
        {user && (
          <li className="pure-menu-item pure-menu-disabled user">Welcome, {user.username}</li>
        )}
        <li className="pure-menu-item">
          <Link to="" role="button" className="pure-menu-link logout" onClick={handleClick}>Log out</Link>
        </li>
      </ul>
    </div>
  );
}
