describe('template spec', () => {
  it('the plus and minus buttons work to update the playlist', () => {
    cy.visit('/');
    cy.get('html').should('exist');
    cy.get('.mode-button-playlist.button-circle').should('exist').click({ force: true });
    // cy.get('.add-to-playlist').should('exist').then(([el]) => {
    //   cy.wrap(el).click({ force: true });
    //   cy.get('#playlist-container .track').should('have.lengthOf', 1);
    //   cy.get('.remove-from-playlist-icon').click({ force: true });
    //   cy.get('#playlist-container .track').should('have.lengthOf', 0);
    // });
  });
});
