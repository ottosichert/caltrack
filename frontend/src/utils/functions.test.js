import { delete_, toLocaleDateTime } from './functions';

it('calls fetch with the correct arguments', () => {
  global.fetch = jest.fn();

  delete_('/url');
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenLastCalledWith('/url', {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
});

it('ignores timezone in toLocaleDateTime', () => {
  expect(toLocaleDateTime(new Date(2019, 0, 2, 3, 45))).toMatchObject(['2019-01-02', '03:45']);
});
