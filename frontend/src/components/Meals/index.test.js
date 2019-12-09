import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '@testing-library/react'

import Meals from '.';
import AppMock from '../App/Mock';
import { get, toLocaleDateTime } from '../../utils/functions';

jest.mock('../../utils/functions');

it('reloads entries when filters are changed', async () => {
  get.mockImplementation(async () => ({
    status: 200
  }));
  toLocaleDateTime.mockImplementation(jest.requireActual('../../utils/functions').toLocaleDateTime);

  let queries;
  await act(async () => {
    queries = await render(
      <AppMock state={{ user: { roles: [] } }}>
        <Meals />
      </AppMock>
    );
  });

  const { getByText } = queries;
  expect(get).toHaveBeenCalledTimes(1);

  await act(async () => {
    await fireEvent.click(getByText('Apply'));
  });
  expect(get).toHaveBeenCalledTimes(2);
});

it('applies to current timezone offset as filter', async () => {
  get.mockImplementation(async () => ({
    status: 200
  }));
  toLocaleDateTime.mockImplementation(jest.requireActual('../../utils/functions').toLocaleDateTime);
  jest.spyOn(global.Date.prototype, 'getTimezoneOffset').mockImplementation(() => 42);

  let queries;
  await act(async () => {
    queries = await render(
      <AppMock state={{ user: { roles: [] } }}>
        <Meals />
      </AppMock>
    );
  });

  const { getByText } = queries;
  expect(get).toHaveBeenLastCalledWith('/api/entries?timezone_offset=42');
});
