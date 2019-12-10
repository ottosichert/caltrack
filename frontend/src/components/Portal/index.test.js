import { createMemoryHistory } from 'history';
import React from 'react';
import { render } from '@testing-library/react'

import Portal from '.';
import AppMock from '../App/Mock';

it('redirects to index if not authenticated', async () => {
  const history = createMemoryHistory();
  history.push('/portal');
  const { getByRole } = render(
    <AppMock history={history}>
      <Portal />
    </AppMock>
  );

  expect(history.location.pathname).toBe('/');
});

it('renders Meals by default', async () => {
  const { getByText } = render(
    <AppMock state={{ user: { roles: [] }}}>
      <Portal />
    </AppMock>
  );

  expect(getByText('New entry')).toBeTruthy();
});
