describe('Users', () => {
  before(() => {
    cy.resetDb();
  });

  beforeEach(() => {
    cy.login('manager', 'manager');
  });

  it('are shown on users page', () => {
    cy.visit('/portal/users');
    cy.get('.table').contains('manager');
  });

  it('can be created', () => {
    cy.visit('/portal/users');
    cy.get('input[name=username]').should('be.enabled').type('dummy').tab();
    cy.focused().type('dummy{enter}');

    cy.get('.table').contains('dummy');
  });

  it('can be edited', () => {
    cy.visit('/portal/users');
    cy.get('.table').as('table').contains('foo').parent().contains('Edit').click();
    cy.get('select[name=role_ids]').should('be.enabled').select('Manager');
    cy.focused().type('{enter}').should('be.enabled');
    cy.get('@table').contains('foo').parent().contains('Manager');
  });

  it('can be deleted', () => {
    cy.visit('/portal/users');
    cy.get('.table').as('table').contains('bar').parent().contains('Delete').click();
    // window.confirm() is automatically accepted by Cypress
    cy.get('@table').contains('bar').should('not.exist');
  });
});
