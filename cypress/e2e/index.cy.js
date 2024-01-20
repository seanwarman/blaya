describe('template spec', () => {
  it('the plus and minus buttons work to update the playlist', () => {
    cy.visit('/');
    cy.get('html').should('exist');
    cy.get('.mode-button-playlist.button-circle').should('exist').click({ force: true });
    cy.get('.add-to-playlist').should('exist').then(([el]) => {
      cy.wrap(el).click({ force: true });
      cy.get('#playlist-container .track').should('have.lengthOf', 1);
      cy.get('.remove-from-playlist-icon').click({ force: true });
      cy.get('#playlist-container .track').should('have.lengthOf', 0);
    });
  });

  it('tracks can be selected by tabbing', () => {
    cy.visit('/');
    cy.get('.track.track-non-tab').then(([el]) => {
      cy.wrap(el).click();
      cy.wrap(el).should('have.focus');
    });
  });

  it('tracks can be played by pressing enter', () => {
    cy.visit('/');
    cy.get('.track.track-non-tab').should('exist').then(([el]) => {
      cy.wrap(el).click();
      cy.wrap(el).should('have.focus');
      cy.intercept('/music/01%20-%20Chris%20Avantgarde%2C%20Anyma%20(ofc)%20-%20Eternity%20(Extended%20Mix).mp3').as('song-request');
      cy.wrap(el).type('{enter}');
      cy.wait('@song-request').should('exist');
    });
  });
});
