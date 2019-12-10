import React, { Fragment } from 'react';

import { toLocaleObject } from '../../utils/functions';
import { useInput, useRole } from '../../utils/hooks';

// component storing form to filter entries based on dates or times
export default function FilterMeals({ update, loading, defaults } = {}) {
  const [values, handleChange, setValues] = useInput(defaults);
  const isAdmin = useRole('Admin');

  const handleClick = event => {
    event.preventDefault();

    // filter out empty values
    const newValues = Object.fromEntries(Object.entries(values).filter(([, value]) => value));
    if (newValues.from_date) {
      newValues.from_date = toLocaleObject(newValues.from_date).toJSON();
    }
    // filter by end of day to match user expectation
    if (newValues.to_date) {
      const endDate = toLocaleObject(newValues.to_date);
      endDate.setDate(endDate.getDate() + 1);
      endDate.setSeconds(endDate.getSeconds() - 1);
      newValues.to_date = endDate.toJSON();
    }
    update(newValues);
  };
  const reset = event => {
    event.preventDefault();
    update(defaults);
    setValues(defaults);
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

        {isAdmin && (
          <Fragment>
            <label className="pure-u-1-3">User ID</label>
            <input
              type="number"
              min={0}
              className="pure-u-2-3"
              name="user_id"
              placeholder="Find User ID in Users tab"
              onChange={handleChange}
              value={values.user_id || ""}
            />
          </Fragment>
        )}
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
