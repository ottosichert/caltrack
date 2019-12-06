import React from 'react';

import { toLocaleObject } from '../../utils/functions';
import { useInput } from '../../utils/hooks';

export default function FilterMeals({ update, loading } = {}) {
  const [values, handleChange, setValues] = useInput();

  const handleClick = event => {
    event.preventDefault();

    // filter out empty values
    const newValues = Object.fromEntries(Object.entries(values).filter(([, value]) => value));
    if (newValues.from_date) {
      newValues.from_date = toLocaleObject(newValues.from_date).toJSON();
    }
    if (newValues.to_date) {
      // filter by end of day to match user expectation
      const endDate = toLocaleObject(newValues.to_date);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setSeconds(endDate.getSeconds() - 1);
      newValues.to_date = endDate.toJSON();
    }
    update(newValues);
  };
  const reset = () => {
    update(null);
    setValues({});
  };

  return (
    <form className="pure-form filter">
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
          onClick={handleClick}
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
