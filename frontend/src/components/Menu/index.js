import React from 'react';
import { Link, NavLink, useHistory } from "react-router-dom";

import { post } from '../../utils/functions';

export default function Menu() {
  const history = useHistory();

  const handleClick = async event => {
    event.preventDefault();
    const response = await post('/api/auth/logout');
    if (response.ok) {
      history.push('/');
    }
  };

  return (
    <div className="pure-menu pure-menu-horizontal menu">
      <span className="pure-menu-heading">CalTrack</span>
      <ul className="pure-menu-list">
        <li className="pure-menu-item">
          <NavLink to="/portal" className="pure-menu-link" activeClassName="pure-menu-selected">Dashboard</NavLink>
        </li>
        <li className="pure-menu-item">
          <Link to="" className="pure-menu-link" onClick={handleClick}>Logout</Link>
        </li>
      </ul>
    </div>
  );
}
