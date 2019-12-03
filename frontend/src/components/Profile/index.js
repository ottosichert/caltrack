import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";

import { patch } from '../../utils/functions';
import { useInput } from '../../utils/hooks';

export default function Profile() {
  const [values, handleChange] = useInput();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useHistory();

  const changingPassword = Boolean(values.old_password || values.new_password);

  const handleSubmit = event => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const endpoint = event.target.action;

    (async () => {
      const response = await patch(endpoint, { body: JSON.stringify(values) });
      setLoading(false);
      if (!response.ok) {
        return setError('Error while saving profile!')
      }
      history.push('/portal');
    })();
  };

  return (
    <form className="pure-form form" method="post" action="/api/profile" onSubmit={handleSubmit}>
      <fieldset className="pure-group">
        <legend>Change password</legend>

        <input
          className="pure-input-1"
          name="old_password"
          placeholder="Old password"
          onChange={handleChange}
          type="password"
          required={changingPassword}
        />
        <input
          className="pure-input-1"
          name="new_password"
          placeholder="New password"
          onChange={handleChange}
          type="password"
          required={changingPassword}
        />
      </fieldset>

      <fieldset className="pure-group">
        <legend>Calories per day</legend>

        <input className="pure-input-1" name="daily_calories" onChange={handleChange} type="number" min={0} />
      </fieldset>

      <div className="pure-button-group">
        <button
          className="pure-button pure-button-primary pure-input-1-2"
          type="submit"
          disabled={loading}
        >
          Save
        </button>
        <Link className="pure-button pure-input-1-2" to="/portal" disabled={loading}>
          Cancel
        </Link>
      </div>

      <span className="pure-form-message error">{error || "\u00a0"}</span>
    </form>
  );
}
