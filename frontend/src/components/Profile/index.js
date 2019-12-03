import React, { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";

import { get, patch } from '../../utils/functions';
import { useInput } from '../../utils/hooks';

export default function Profile() {
  const [values, handleChange, setValues] = useInput();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const history = useHistory();

  const endpoint = "/api/profile";
  useEffect(() => {
    (async () => {
      const response = await get(endpoint);
      if (!response.ok) {
        return setError('Error while loading profile! Please reload page.');
      }
      const profile = await response.json();
      setValues(profile);
      setLoading(false);
    })();
  }, [setValues]);

  const handleSubmit = event => {
    event.preventDefault();
    setLoading(true);
    setError("");

    (async () => {
      const response = await patch(endpoint, { body: JSON.stringify(values) });
      setLoading(false);
      if (!response.ok) {
        return setError('Error while saving profile!')
      }
      history.push('/portal');
    })();
  };

  const changingPassword = Boolean(values.old_password || values.new_password);

  return (
    <form className="pure-form form" method="post" action={endpoint} onSubmit={handleSubmit}>
      <fieldset className="pure-group" disabled={loading}>
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

      <fieldset className="pure-group" disabled={loading}>
        <legend>Calories per day</legend>

        <input
          className="pure-input-1"
          name="daily_calories"
          onChange={handleChange}
          type="number"
          min={0}
          value={values.daily_calories || ""}
        />
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
