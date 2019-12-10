import { createMemoryHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '@testing-library/react'

import Profile from '.';
import AppMock from '../App/Mock';
import { get, patch } from '../../utils/functions';

jest.mock('../../utils/functions');

it('only requires password fields if any value is entered', async () => {
  get.mockImplementation(async () => ({
    status: 200
  }));

  const { getByPlaceholderText } = render(
    <AppMock>
      <Profile />
    </AppMock>
  );
  const oldPassword = getByPlaceholderText('Old password');
  const newPassword = getByPlaceholderText('New password');

  expect(oldPassword).not.toHaveAttribute('required');
  expect(newPassword).not.toHaveAttribute('required');

  await act(async () => {
    await fireEvent.change(oldPassword, { target: { value: 'foo' }});
  });

  expect(oldPassword).toHaveAttribute('required');
  expect(newPassword).toHaveAttribute('required');
});

it('only redirects to portal if update succeeds', async () => {
  patch.mockImplementation(async () => ({
    ok: false
  }));

  const history = createMemoryHistory();
  history.push('/portal/profile');
  const { getByRole } = render(
    <AppMock history={history}>
      <Profile />
    </AppMock>
  );
  const save = getByRole('button');

  await act(async () => {
    await fireEvent.submit(save);
  });
  expect(history.location.pathname).toBe('/portal/profile');

  patch.mockClear().mockImplementation(async () => ({
    ok: true
  }));

  await act(async () => {
    await fireEvent.submit(save);
  });
  expect(history.location.pathname).toBe('/portal');
});
