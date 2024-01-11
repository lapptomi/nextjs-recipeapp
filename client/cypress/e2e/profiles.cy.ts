/// <reference types="cypress" />

import { API_URL, user } from "../data";

describe('Profiles', () => {
  beforeEach(() => {
    cy.request('DELETE', `${API_URL}/api/users`);
    cy.request('POST', `${API_URL}/api/users`);

    cy.visit("/auth/login");
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="email"]').should('have.value', user.email);

    cy.get('input[name="password"]').type(user.password);
    cy.get('input[name="password"]').should('have.value', user.password);

    cy.get('button').contains('Sign In').click();
    
    cy.get('button').contains(user.username).click();
    cy.get('a').contains('Profile').click();
  });

  /*
  it('Renders profile page correctly', () => {
    cy.contains('Followers');
    cy.contains('Some random data here');
  });
  */

});
