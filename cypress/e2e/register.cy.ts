/// <reference types="cypress" />

import { user } from "./data";

describe('Creating new user', () => {
  beforeEach(() => {
    cy.request('DELETE', 'http://localhost:3000/api/users')
      .then(() => {
        cy.visit("http://localhost:3000/auth/register");
      });
  });

  it('Displays register form', () => {
    cy.contains('Sign Up');
    cy.contains('Email Address');
    cy.contains('Password');
  });

  it('Redirects to /recipes page after successful registration', () => {
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="email"]').should('have.value', user.email);

    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="username"]').should('have.value', user.username);

    cy.get('input[name="password"]').type(user.password);
    cy.get('input[name="password"]').should('have.value', user.password);

    cy.get('input[name="confirmPassword"]').type(user.password);
    cy.get('input[name="confirmPassword"]').should('have.value', user.password);

    cy.get('button').contains('Sign Up').click();

    cy.url().should('include', '/recipes');
  });

  it('Displays error message on invalid email', () => {
    cy.get('input[name="email"]').type('invalidemail');
    cy.get('input[name="email"]').should('have.value', 'invalidemail');

    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="username"]').should('have.value', user.username);

    cy.get('input[name="password"]').type(user.password);
    cy.get('input[name="password"]').should('have.value', user.password);

    cy.get('input[name="confirmPassword"]').type(user.password);
    cy.get('input[name="confirmPassword"]').should('have.value', user.password);

    cy.get('button').contains('Sign Up').click();

    cy.url().should('include', '/auth/register');
  });

  it('Displays error message on invalid username', () => {
    // Cehck that 1 == 1
    expect(1).to.equal(2);
  });

});
