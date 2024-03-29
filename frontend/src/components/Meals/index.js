import React, { Fragment, useCallback, useState } from 'react';

import Edit from './Edit';
import Filters from './Filters';
import { delete_ } from '../../utils/functions';
import { useResource, useRole } from '../../utils/hooks';

// portal index page providing Meals display, filtering, creation, editing and deletion
export default function Meals() {
  const [version, setVersion] = useState(0);
  const [meal, setMeal] = useState(null);

  const endpoint = '/api/entries';
  const isAdmin = useRole('Admin');

  // pass client side timezone offset to backend to handle time based filtering
  const timezoneOffset = (new Date()).getTimezoneOffset();
  const defaultFilter = { timezone_offset: timezoneOffset };
  const [filters, setFilters] = useState(defaultFilter);
  const [entries, entriesLoading, entriesError] = useResource(endpoint, [version], { filters });

  const resetMeal = useCallback(() => setMeal(null), [setMeal]);
  const incrementVersion = useCallback(() => setVersion(version + 1), [setVersion, version]);
  const handleEdit = meal => event => setMeal(meal);

  // simple solution to prevent accidental deletion of entries
  const handleDelete = meal => async event => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Do you really want to delete entry "${meal.label}"?`)) {
      await delete_(`${endpoint}/${meal.id}`);
      incrementVersion();
    }
  };

  // as users can't access user IDs the column will be hidden
  const columns = isAdmin ? 6 : 5;

  return (
    <Fragment>
      <Edit endpoint={endpoint} resource={meal} reset={resetMeal} save={incrementVersion} />
      <Filters update={setFilters} loading={entriesLoading} defaults={defaultFilter} />

      <table className="pure-table table">
        <thead>
          <tr>
            {isAdmin && (
              <th>User ID</th>
            )}
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
              <td colSpan={columns}>Loading meals...</td>
            </tr>
          )}
          {entries && entries.length === 0 && (
            <tr>
              <td colSpan={columns}>No entries found! Adjust filters or submit entries above</td>
            </tr>
          )}
          {entries && entries.map(entry => {
            // alwayss show datetimes in local timezone
            const datetime = new Date(entry.datetime);
            return (
              <tr key={entry.id} className={entry.calories_exceeded ? 'exceed' : 'match'}>
                {isAdmin && (
                  <td>{entry.user_id}</td>
                )}
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
              <td colSpan={columns}>{entriesError}</td>
            </tr>
          )}
        </tbody>
      </table>
    </Fragment>
  );
}
