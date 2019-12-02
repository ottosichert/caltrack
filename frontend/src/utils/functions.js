export const json = (url, options) => fetch(url, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  ...options,
});

export const post = (url, options) => json(url, { method: 'post', ...options });
