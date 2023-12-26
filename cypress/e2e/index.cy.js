describe('template spec', () => {
  before(cy.authAllRequests);
  beforeEach(cy.authAllRequests);

  it('the plus and minus buttons work to update the playlist', () => {
    cy.authAllRequests();
    cy.visit('/');
    cy.get('.mode-button-playlist.button-circle').click();
    cy.get('.add-to-playlist').then(([el]) => {
      cy.wrap(el).click({ force: true });
      cy.get('#playlist-container .track').should('have.lengthOf', 1);
      cy.get('.remove-from-playlist-icon').click();
      cy.get('#playlist-container .track').should('have.lengthOf', 0);
    });
  });
});
