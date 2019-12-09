describe('User meals', () => {
  before(() => {
    cy.resetDb();
  });

  beforeEach(() => {
    cy.login('user', 'user');
  });

  it('are shown on dashboard', () => {
    cy.visit('/portal');
    cy.get('.table').as('table').contains('Porridge');
    cy.get('@table').contains('Nachos');
  });

  it('can be created', () => {
    cy.visit('/portal');
    cy.get('input[name=label]').type('Beer').tab();
    cy.focused().type('200{enter}');
    cy.get('.table').contains('Beer').parent().contains('200');
  });

  it('can be edited', () => {
    cy.visit('/portal');
    cy.get('.table').contains('Pizza').parent().contains('Edit').click();
    cy.get('input[name=label]').clear().type('Half pizza').tab();
    cy.focused().type('400{enter}');
    cy.get('.table').contains('Half pizza').parent().contains('400');
  });

  it('can be deleted', () => {
    cy.visit('/portal');
    cy.get('.table').as('table').contains('Pasta').parent().contains('Delete').click();
    // window.confirm() is automatically accepted by Cypress
    cy.get('@table').contains('Pasta').should('not.exist');
  });
});
