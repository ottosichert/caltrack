import { createMemoryHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react'

import Store from '.';
import { StoreConsumer } from './Mock';

it('hydrates state from localStorage', () => {
  const initialState = { user: { roles: ['test'] } };
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => JSON.stringify(initialState));

  const { container } = render(
    <Store>
      <StoreConsumer />
    </Store>
  );

  const state = JSON.parse(container.textContent);
  expect(state).toMatchObject(initialState);
});

it('resets the user state when logging out', async () => {
  const initialState = { user: { roles: ['test'] } };
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => JSON.stringify(initialState));
  const inspection = {};

  const { container } = render(
    <Store>
      <StoreConsumer inspection={inspection} />
    </Store>
  );

  await act(async () => {
    await inspection.dispatch({ type: 'logout' });
  });

  const state = JSON.parse(container.textContent);
  expect(state).toMatchObject({ user: null });
});
