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
