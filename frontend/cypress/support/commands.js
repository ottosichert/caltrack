// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('resetDb', () => {
  cy.exec('yarn test:reset');
});

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
