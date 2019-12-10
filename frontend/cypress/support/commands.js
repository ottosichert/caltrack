// wipe and recreate database for clean test runs
Cypress.Commands.add('resetDb', () => {
  cy.exec('yarn test:reset');
});

// persist credentials for a single test run, needs be called in `beforeEach`
Cypress.Commands.add('login', (username, password) => {
  cy.request({
    method: 'post',
    url: '/api/auth/login',
    body: { username, password }
  }).then(json => {
    localStorage.setItem('caltrack', JSON.stringify({ user: json.body }));
  });
  Cypress.Cookies.preserveOnce('session');
});
