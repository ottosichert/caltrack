describe('User authentication', () => {
  before(() => {
    cy.resetDb();
  });

  it('prevents logging in with wrong credentials', () => {
    cy.visit('/');
    cy.get('input[name=username]').type('nope');
    cy.get('input[name=password]').type('nope{enter}');
    cy.get('.error').contains('Unable to Login! Please try again.');
  });

  it('correctly implements autofocus and tab indizes', () => {
    cy.visit('/');
    cy.focused().type('nope').tab();
    cy.focused().type('nope{enter}');
    cy.get('.error').contains('Unable to Login! Please try again.');
  });

  it('allows logging in and out with working credentials', () => {
    cy.visit('/');
    cy.focused().type('user').tab();
    cy.focused().type('user{enter}');
    cy.location('pathname').should('eq', '/portal');

    cy.get('.logout').click();
    cy.location('pathname').should('eq', '/');
  });

  it('handles registration like logging in', () => {
    cy.visit('/');
    cy.focused().type('new_user').tab();
    cy.focused().type('new_user').tab().tab().click();
    cy.location('pathname').should('eq', '/portal');

    cy.get('.logout').click();
    cy.location('pathname').should('eq', '/');
  });

  it('redirects according to logged in state', () => {
    cy.visit('/portal');
    cy.location('pathname').should('eq', '/');

    cy.focused().type('user').tab();
    cy.focused().type('user{enter}');
    cy.location('pathname').should('eq', '/portal');
    cy.visit('/');
    cy.location('pathname').should('eq', '/portal');

    cy.get('.logout').click();
    cy.location('pathname').should('eq', '/');
    cy.visit('/portal');
    cy.location('pathname').should('eq', '/');
  });
});
