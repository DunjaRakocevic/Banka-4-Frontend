describe('smoke', () => {
  it('opens login', () => {
    cy.visit('/login');
    cy.contains(/Prijavi se/i).should('be.visible');
  });
});