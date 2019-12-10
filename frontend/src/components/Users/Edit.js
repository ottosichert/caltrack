import React, { useEffect, useState } from 'react';

import { json } from '../../utils/functions';
import { useInput, useResource } from '../../utils/hooks';

// similar to <EditMeals> provide a single form for both creation and modification
export default function EditUser({ endpoint, resource, reset, save } = {}) {
  const [values, handleChange, setValues] = useInput();
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roles, rolesLoading, rolesError] = useResource('/api/roles', [resource], { role: 'Manager', redirect: '/portal' });

  // load user into edit form
  useEffect(() => {
    const newValues = {...resource};
    if (newValues.roles) {
      newValues.role_ids = newValues.roles.map(role => role.id);
      delete newValues.roles;
    }
    delete newValues.id;
    setValues(newValues);
    setError(null);
  }, [resource, setValues]);

  const handleClick = async event => {
    // let form submission handle required fields
    if (!values.username || (!resource && !values.password)) {
      return;
    }

    event.preventDefault();
    setError(null);
    setLoading(true);
    const url = event.target.formAction;
    const method = event.target.dataset.formmethod;
    const response = await json(url, { method, body: JSON.stringify(values) });
    setLoading(false);
    if (!response.ok) {
      return setError('Error while saving user!');
    }
    setVersion(version + 1);
    setValues({});
    save();
    reset();
  };

  return (
    <form className="pure-form form">
      <fieldset className="pure-group" disabled={loading || rolesLoading || rolesError}>
        <legend>{resource ? `Edit user "${resource.username}"` : 'New user'}</legend>

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
          required={!resource}
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

      {resource ? (
        <div className="pure-button-group">
          <button
            className="pure-button pure-button-primary pure-input-1-2"
            type="submit"
            formAction={`${endpoint}/${resource.id}`}
            data-formmethod="patch"
            onClick={handleClick}
            disabled={loading}
          >
            Save
          </button>
          <button
            className="pure-button pure-input-1-2"
            onClick={reset}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className="pure-button pure-button-primary pure-input-1"
          type="submit"
          formAction={endpoint}
          data-formmethod="post"
          onClick={handleClick}
          disabled={loading}
        >
          Create
        </button>
      )}
      <span className="pure-form-message error">{error || rolesError || "\u00a0"}</span>
    </form>
  );
}
