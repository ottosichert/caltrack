import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

import { post } from '../../utils/functions';
import { useInput } from '../../utils/hooks';

export default function Form() {
  const [values, handleChange] = useInput();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  const handleClick = event => {
    // let form submission handle required fields
    if (!values.username || !values.password) {
      return;
    }

    event.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = event.target.formAction;
    const display = event.target.textContent;

    (async () => {
      const response = await post(endpoint, { body: JSON.stringify(values) });
      setLoading(false);
      if (!response.ok) {
        return setError(`Unable to ${display}! Please try again.`)
      }

      const user = await response.json();
      // do something with user

      history.push('/portal');
    })();
  };

  return (
    <div className="container">
      <h1 className="title">CalTrack</h1>

      <form className="pure-form form" method="post">
        <fieldset className="pure-group" disabled={loading}>
          <input className="pure-input-1" name="username" required placeholder="Username" onChange={handleChange} />
          <input className="pure-input-1" name="password" required placeholder="Password" onChange={handleChange} type="password" />
        </fieldset>

        <div className="pure-button-group">
          <button
            className="pure-button pure-button-primary pure-input-1-2"
            type="submit"
            formAction="/api/auth/login"
            onClick={handleClick}
            disabled={loading}
          >
            Login
          </button>
          <button
            className="pure-button pure-input-1-2"
            type="submit"
            formAction="/api/auth/register"
            onClick={handleClick}
            disabled={loading}
          >
            Register
          </button>
        </div>

        <span className="pure-form-message error">{error || "\u00a0"}</span>
      </form>
    </div>
  );
}
