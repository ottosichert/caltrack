import React from 'react';

import { useInput } from '../../utils/hooks';

export default function EditFilters({ update, loading } = {}) {
  const [values, handleChange, setValues] = useInput();

  const handleSubmit = event => {
    event.preventDefault();
    update(values);
  };
  const reset = () => {
    update(null);
    setValues({});
  };

  return (
    <form className="pure-form filter" onSubmit={handleSubmit}>
      <fieldset className="pure-g" disabled={loading}>
        <legend className="pure-u-1">Filter entries</legend>

        <label className="pure-u-1-3">Date range</label>
        <input
          type="date"
          className="pure-u-1-3"
          name="from_date"
          placeholder="Date"
          onChange={handleChange}
          value={values.from_date || ""}
        />
        <input
          type="date"
          className="pure-u-1-3"
          name="to_date"
          placeholder="Date"
          onChange={handleChange}
          value={values.to_date || ""}
        />

        <label className="pure-u-1-3">Time range</label>
        <input
          type="time"
          className="pure-u-1-3"
          name="from_time"
          placeholder="Time"
          onChange={handleChange}
          value={values.from_time || ""}
        />
        <input
          type="time"
          className="pure-u-1-3"
          name="to_time"
          placeholder="Time"
          onChange={handleChange}
          value={values.to_time || ""}
        />
      </fieldset>

      <div className="pure-button-group pure-u-1">
        <button
          className="pure-button pure-button-primary pure-input-1-2"
          type="submit"
          disabled={loading}
        >
          Apply
        </button>
        <button
          className="pure-button pure-input-1-2"
          onClick={reset}
          disabled={loading}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
