/// <reference types="cypress" />

describe('Random', () => {
  it('Passing test', () => {
    expect(true).to.equal(true);
  });

  it('Visit', () => {
    cy.visit('/');
  });
});
