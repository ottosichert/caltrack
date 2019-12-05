import React, { useEffect, useState } from 'react';

import { toLocaleDateTime, json } from '../../utils/functions';
import { useInput } from '../../utils/hooks';

export default function EditMeals({ endpoint, resource, reset, save } = {}) {
  const [values, handleChange, setValues] = useInput();
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // load meal into edit form
  useEffect(() => {
    const newValues = {...resource};
    let datetime;
    if (newValues.datetime) {
      datetime = new Date(newValues.datetime);
      delete newValues.datetime;
    } else {
      datetime = new Date();
    }
    const [date, time] = toLocaleDateTime(datetime);
    newValues.date = date;
    newValues.time = time;
    setValues(newValues);
    setError(null);
  }, [resource, setValues]);

  const handleClick = async event => {
    // let form submission handle required fields
    if (!values.date || !values.time || !values.label || !values.calories) {
      return;
    }

    event.preventDefault();
    setError(null);
    setLoading(true);
    const url = event.target.formAction;
    const method = event.target.dataset.formmethod;
    const utcValues = {
      calories: values.calories,
      label: values.label,
      datetime: (new Date(`${values.date}T${values.time}:00`)).toJSON(),
    };
    const response = await json(url, { method, body: JSON.stringify(utcValues) });
    setLoading(false);
    if (!response.ok) {
      return setError('Error while creating entry!');
    }
    setVersion(version + 1);
    const [date, time] = toLocaleDateTime(new Date());
    setValues({ date, time });
    save();
    reset();
  };

  return (
    <form className="pure-form form">
      <fieldset className="pure-group" disabled={loading}>
        <legend>{resource ? `Edit entry "${resource.label}"` : 'New entry'}</legend>

        <input
          type="date"
          className="pure-input-1-2 left"
          name="date"
          placeholder="Date"
          onChange={handleChange}
          required
          value={values.date || ""}
        />
        <input
          type="time"
          className="pure-input-1-2 right"
          name="time"
          placeholder="Time"
          onChange={handleChange}
          required
          value={values.time || ""}
        />
        <input
          className="pure-input-1"
          name="label"
          placeholder="Label"
          onChange={handleChange}
          required
          value={values.label || ""}
        />
        <input
          className="pure-input-1"
          name="calories"
          placeholder="Calories"
          onChange={handleChange}
          type="number"
          min={0}
          value={values.calories || ""}
          required
        />
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
      <span className="pure-form-message error">{error || "\u00a0"}</span>
    </form>
  );
}
