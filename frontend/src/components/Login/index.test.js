import { createMemoryHistory } from 'history';
import React from 'react';
import { render } from '@testing-library/react'

import Login from '.';
import AppMock from '../App/Mock';

it('renders login and register buttons', () => {
  const { getAllByRole } = render(
    <AppMock>
      <Login />
    </AppMock>
  );
  const [login, register] = getAllByRole('button');

  expect(login).toHaveAttribute('formAction', '/api/auth/login');
  expect(register).toHaveAttribute('formAction', '/api/auth/register');
});

it('redirects to the portal if logged in locally', () => {
  const history = createMemoryHistory();
  render(
    <AppMock history={history} state={{ user: {} }}>
      <Login />
    </AppMock>
  );

  expect(history.location.pathname).toBe('/portal');
});
