describe('CalTrack app', () => {
  it('loads JavaScript entry point', () => {
    cy.visit('/');
    cy.get('.title').contains('CalTrack').should('have.css', 'text-align').and('eq', 'center');
  });

  it('loads styles properly', () => {
    cy.visit('/');
    // caltrack.css
    cy.get('.title').should('have.css', 'text-align').and('eq', 'center');
    // pure.css
    cy.get('.pure-button-primary').should('have.css', 'background-color').and('eq', 'rgb(0, 120, 231)');
  });

  it('shows an error on unauthenticated API endpoint requests', () => {
    cy.request({
      url: '/api/profile',
      failOnStatusCode: false,
    }).its('status').should('eq', 403);
  });
});
