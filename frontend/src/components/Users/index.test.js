import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '@testing-library/react'

import Users from '.';
import AppMock from '../App/Mock';
import { get } from '../../utils/functions';

jest.mock('../../utils/functions');

it('asks for confirmation before deleting', async () => {
  get.mockImplementation(async () => ({
    ok: true,
    json: async () => ([{
      id: 1,
      username: 'test',
      roles: [{ id: 1, name: 'test' }]
    }]),
  }));
  jest.spyOn(global, 'confirm').mockImplementation(() => false);

  let queries;
  await act(async () => {
    queries = await render(
      <AppMock state={{ user: { roles: ['Manager'] } }}>
        <Users />
      </AppMock>
    );
  });

  const { getByText } = queries;

  await act(async () => {
    await fireEvent.click(getByText('Delete'));
  });
  expect(global.confirm).toHaveBeenCalledTimes(1);
});
