import React from 'react';
import { Link, NavLink } from "react-router-dom";

import { useStore } from '../Store';
import { post } from '../../utils/functions';
import { useAuthentication } from '../../utils/hooks';

export default function Menu() {
  const [user, dispatch] = useStore(state => state.user);

  useAuthentication();

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
        {user && user.roles.includes('Manager') && (
          <li className="pure-menu-item">
            <NavLink to="/portal/users" className="pure-menu-link" activeClassName="pure-menu-selected">Users</NavLink>
          </li>
        )}
        {user && (
          <li className="pure-menu-item pure-menu-disabled user">Welcome, {user.username}</li>
        )}
        <li className="pure-menu-item">
          <Link to="" className="pure-menu-link" onClick={handleClick}>Log out</Link>
        </li>
      </ul>
    </div>
  );
}
