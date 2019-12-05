import React, { Fragment, useState } from 'react';

import { post } from '../../utils/functions';
import { useInput, useResource } from '../../utils/hooks';

export default function Meals() {
  // get timezone naive datetime for user input
  const utcNow = new Date();
  const offset = utcNow.getTimezoneOffset();
  const now = (new Date(utcNow.getTime() - offset * 60 * 1000)).toJSON();
  const [date, time] = now.substring(0, now.lastIndexOf(':')).split('T');

  const [values, handleChange, setValues] = useInput({ date, time });
  const [version, setVersion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const endpoint = '/api/entries';
  const [entries, entriesLoading, entriesError] = useResource(endpoint, [version]);

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const utcValues = {
      calories: values.calories,
      label: values.label,
      datetime: (new Date(`${values.date}T${values.time}:00`)).toJSON(),
    };
    const response = await post(endpoint, { body: JSON.stringify(utcValues) });
    setLoading(false);
    if (!response.ok) {
      return setError('Error while creating entry!');
    }
    setVersion(version + 1);
    setValues({ date, time });
  };

  return (
    <Fragment>
      <form className="pure-form form" method="post" action={endpoint} onSubmit={handleSubmit}>
        <fieldset className="pure-group" disabled={loading}>
          <legend>New entry</legend>

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

        <button className="pure-button pure-button-primary pure-input-1" type="submit">Create</button>
        <span className="pure-form-message error">{error || "\u00a0"}</span>
      </form>

      <table className="pure-table pure-table-striped table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Label</th>
            <th>Calories</th>
            <th>&nbsp;</th>
          </tr>
        </thead>

        <tbody>
          {entriesLoading && (
            <tr>
              <td colSpan={5}>Loading meals...</td>
            </tr>
          )}
          {entries && entries.length === 0 && (
            <tr>
              <td colSpan={5}>No meals submitted yet! Use the form above</td>
            </tr>
          )}
          {entries && entries.map(entry => {
            const datetime = new Date(entry.datetime);
            return (
              <tr key={entry.id}>
                <td>{datetime.toLocaleDateString()}</td>
                <td>{datetime.toLocaleTimeString()}</td>
                <td>{entry.label}</td>
                <td>{entry.calories}</td>
                <td>Actions</td>
              </tr>
            );
          })}
          {entriesError && (
            <tr>
              <td colSpan={5}>{entriesError}</td>
            </tr>
          )}
        </tbody>
      </table>
    </Fragment>
  );
}
