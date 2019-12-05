import React, { Fragment, useCallback, useState } from 'react';

import Edit from './Edit';
import { delete_ } from '../../utils/functions';
import { useResource } from '../../utils/hooks';

export default function Meals() {
  const [version, setVersion] = useState(0);
  const [meal, setMeal] = useState(null);

  const endpoint = '/api/entries';
  const [entries, entriesLoading, entriesError] = useResource(endpoint, [version]);

  const resetMeal = useCallback(() => setMeal(null), [setMeal]);
  const incrementVersion = useCallback(() => setVersion(version + 1), [setVersion, version]);
  const handleEdit = meal => event => setMeal(meal);
  const handleDelete = meal => async event => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Do you really want to delete entry "${meal.label}"?`)) {
      await delete_(`${endpoint}/${meal.id}`);
      incrementVersion();
    }
  };

  return (
    <Fragment>
      <Edit endpoint={endpoint} resource={meal} reset={resetMeal} save={incrementVersion} />

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
                <td>
                  <div className="pure-button-group">
                    <button className="pure-button pure-button-primary" onClick={handleEdit(entry)}>Edit</button>
                    <button className="pure-button" onClick={handleDelete(entry)}>Delete</button>
                  </div>
                </td>
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
