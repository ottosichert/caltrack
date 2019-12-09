describe('User profile', () => {
  before(() => {
    cy.resetDb();
  });

  beforeEach(() => {
    cy.login('user', 'user');
  });

  it('displays editable daily calories field', () => {
    cy.visit('/portal/profile');
    cy.get('input[name=daily_calories]').as('calories').should('have.value', '2000');

    cy.get('@calories').clear().type('2500{enter}');
    cy.visit('/portal/profile');
    cy.get('@calories').should('have.value', '2500');
  });
});
