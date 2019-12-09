describe('Meals', () => {
  before(() => {
    cy.resetDb();
  });

  context('as user', () => {
    beforeEach(() => {
      cy.login('user', 'user');
    });

    it('are shown on dashboard', () => {
      cy.visit('/portal');
      cy.get('.table').contains('Porridge');
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

  context('as admin', () => {
    beforeEach(() => {
      cy.login('admin', 'admin');
    });

    it('are shown on dashboard for admin and other users', () => {
      cy.visit('/portal');
      cy.get('.table').as('table').contains('Cappucino');

      cy.get('.filter input[name=user_id]').should('be.enabled').type('1{enter}');
      cy.get('@table').contains('Steak');
    });

    it('can be created for other users', () => {
      cy.visit('/portal');
      cy.get('input[name=label]').type('Business breakfast').tab();
      cy.focused().type('900').tab();
      cy.focused().type('2{enter}');

      cy.get('.filter input[name=user_id]').should('be.enabled').type('2{enter}');
      cy.get('.table').contains('Business breakfast');
    });

    it('can be edited for other users', () => {
      cy.visit('/portal');
      cy.get('.filter input[name=user_id]').should('be.enabled').type('1{enter}');

      cy.get('.table').contains('Bacon and eggs').parent().contains('Edit').click();
      cy.get('input[name=label]').clear().type('Vegan bacon and falafel').tab();
      cy.focused().type('600').tab();
      cy.focused().type('1{enter}');
      cy.get('.table').contains('Vegan bacon and falafel').parent().contains('600');
    });

    it('can be deleted for other users', () => {
      cy.visit('/portal');
      cy.get('.filter input[name=user_id]').should('be.enabled').type('1{enter}');

      cy.get('.table').as('table').contains('Nachos').parent().contains('Delete').click();
      // window.confirm() is automatically accepted by Cypress
      cy.get('@table').contains('Nachos').should('not.exist');
    });
  });
});
