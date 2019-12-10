import { createMemoryHistory } from 'history';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { fireEvent, render } from '@testing-library/react'

import Menu from '.';
import AppMock from '../App/Mock';
import { post } from '../../utils/functions';

jest.mock('../../utils/functions');

it('posts to logout endpoint and navigates to index', async () => {
  post.mockImplementation(async () => ({
    ok: true
  }));

  const history = createMemoryHistory();
  const dispatch = jest.fn();
  const { getByRole } = render(
    <AppMock history={history} state={{ user: { roles: [] } }} dispatch={dispatch}>
      <Menu />
    </AppMock>
  );
  expect(post).not.toHaveBeenCalled();

  await act(async () => {
    await fireEvent.click(getByRole('button'));
  });

  expect(post).toHaveBeenCalledTimes(1);
  expect(post).toHaveBeenLastCalledWith('/api/auth/logout');
  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toHaveBeenLastCalledWith({ type: 'logout' });
});
