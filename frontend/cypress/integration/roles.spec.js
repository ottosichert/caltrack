describe('Role', () => {
  before(() => {
    cy.resetDb();
  });

  it('user can only access own meals', () => {
    cy.login('user', 'user');
    cy.visit('/portal/users');
    cy.location('pathname').should('eq', '/portal');

    cy.get('.table').as('table').contains('User ID').should('not.exist');
    cy.get('@table').contains('Business dinner').should('not.exist');
    cy.get('@table').contains('Cappucino').should('not.exist');
  });

  it('manager can access own meals and users', () => {
    cy.login('manager', 'manager');
    cy.visit('/portal/users');
    cy.location('pathname').should('eq', '/portal/users');

    cy.visit('/portal');
    cy.get('.table').as('table').contains('User ID').should('not.exist');
    cy.get('@table').contains('Business dinner');
    cy.get('@table').contains('Cappucino').should('not.exist');
  });

  it('admin can access all meals and users', () => {
    cy.login('admin', 'admin');
    cy.visit('/portal/users');
    cy.location('pathname').should('eq', '/portal/users');

    cy.visit('/portal');
    cy.get('.table').as('table').contains('User ID');
    cy.get('@table').contains('Cappucino');

    cy.get('.filter input[name=user_id]').type('2{enter}');
    cy.get('@table').contains('Business dinner');
  });
});
