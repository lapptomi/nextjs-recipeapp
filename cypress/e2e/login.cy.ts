/// <reference types="cypress" />

import { user } from "./data";

describe('Login', () => {
  beforeEach(() => {
    /*
    cy.request('DELETE', 'http://localhost:3000/api/users')
      .then(() => {
        cy.request('POST', 'http://localhost:3000/api/users', user);
      })
      .then(() => {
        cy.wait(1000);
        cy.visit("http://localhost:3000/auth/login");
      });
    */
    cy.request('DELETE', 'http://localhost:3000/api/users');
    cy.request('POST', 'http://localhost:3000/api/users', user);
    return cy.visit("http://localhost:3000/auth/login");
  });

  it('Displays login form', () => {
    cy.contains('Sign In');
    cy.contains('Email Address');
    cy.contains('Password');
  });

  it('Displays error message on invalid login', () => {
    cy.get('input[name="email"]').type('invalidemail');
    cy.wait(500);
    cy.get('input[name="email"]').should('have.value', 'invalidemail');

    cy.get('input[name="password"]').type('invalid');
    cy.wait(500);
    cy.get('input[name="password"]').should('have.value', 'invalid');

    cy.get('button').contains('Sign In').click();
    
    cy.contains('Invalid or missing credentials');
  });

  it('Redirects to recipes on valid login', () => {
    cy.get('input[name="email"]').type(user.email);
    cy.wait(500);
    cy.get('input[name="email"]').should('have.value', user.email);

    cy.get('input[name="password"]').type(user.password);
    cy.wait(500);
    cy.get('input[name="password"]').should('have.value', user.password);

    cy.get('button').contains('Sign In').click();

    cy.wait(1000);
    cy.url().should('include', '/recipes');
  });

});
