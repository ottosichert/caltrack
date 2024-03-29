import React, { useEffect, useState } from 'react';
import { Link, useHistory } from "react-router-dom";

import { patch } from '../../utils/functions';
import { useInput, useResource } from '../../utils/hooks';

// allow changes to the current user profile and credentials
export default function Profile() {
  const [values, handleChange, setValues] = useInput();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  // retrieve current values before updating
  const endpoint = "/api/profile";
  const [profile, profileLoading, profileError] = useResource(endpoint);

  // load retrieved values into form
  useEffect(() => {
    setValues(profile || {});
  }, [setValues, profile]);

  const handleSubmit = event => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    (async () => {
      const response = await patch(endpoint, { body: JSON.stringify(values) });
      setLoading(false);
      if (!response.ok) {
        return setError('Error while saving profile!')
      }
      history.push('/portal');
    })();
  };

  // only require password fields once any value was entered
  const changingPassword = Boolean(values.old_password || values.new_password);
  const disabled = loading || profileLoading || profileError;

  return (
    <form className="pure-form form" method="post" action={endpoint} onSubmit={handleSubmit}>
      <fieldset className="pure-group" disabled={disabled}>
        <legend>Calories per day</legend>

        <input
          className="pure-input-1"
          name="daily_calories"
          onChange={handleChange}
          type="number"
          min={1}
          value={values.daily_calories || ""}
          required
        />
      </fieldset>

      <fieldset className="pure-group" disabled={disabled}>
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

      <div className="pure-button-group">
        <button
          className="pure-button pure-button-primary pure-input-1-2"
          type="submit"
          disabled={disabled}
        >
          Save
        </button>
        <Link className="pure-button pure-input-1-2" to="/portal" disabled={disabled}>
          Cancel
        </Link>
      </div>

      <span className="pure-form-message error">{error || profileError || "\u00a0"}</span>
    </form>
  );
}
