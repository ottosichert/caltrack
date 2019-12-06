export const json = (url, options) => fetch(url, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  ...options,
});

const factory = method => (url, options) => json(url, { method, ...options });
export const patch = factory('patch');
export const post = factory('post');
export const delete_ = factory('delete');
export const get = json;

// Example: toDateTime(new Date(2019, 0, 2, 3, 45)) === ['2019-01-02', '03:45']
export const toLocaleDateTime = datetime => {
  const offset = datetime.getTimezoneOffset();
  const now = (new Date(datetime.getTime() - offset * 60 * 1000)).toJSON();
  const [date, time] = now.substring(0, now.lastIndexOf(':')).split('T');
  return [date, time];
};
export const toLocaleObject = (date, time = '00:00') => new Date(`${date}T${time}:00`);
