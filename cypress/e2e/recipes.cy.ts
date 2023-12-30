/// <reference types="cypress" />

import { recipe, user } from "../data";

describe('Recipes', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/users');

    cy.request('POST', '/api/users', user);
    cy.visit("/auth/login");
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="email"]').should('have.value', user.email);

    cy.get('input[name="password"]').type(user.password);
    cy.get('input[name="password"]').should('have.value', user.password);

    cy.get('button').contains('Sign In').click();
    cy.contains('BROWSE RECIPES');
  });

  it('Renders "No recipes found" when database doesnt contain recipes', () => {
    cy.contains('No recipes found');
  });

  it('Can be created with correct data', () => {
    cy.visit("/recipes/create");
    cy.contains('CREATE RECIPE');

    cy.get('input[name="title"]').type(recipe.title);
    cy.get('input[name="title"]').should('have.value', recipe.title);

    cy.get('input[name="description"]').type(recipe.description);
    cy.get('input[name="description"]').should('have.value', recipe.description);

    cy.get('textarea[name="instructions"]').type(recipe.instructions);
    cy.get('textarea[name="instructions"]').should('have.value', recipe.instructions);

    cy.get('button').contains('Submit').click();

    cy.contains('Test recipe', { matchCase: false });
    cy.contains('Test description', { matchCase: false });
    cy.contains('Test instructions', { matchCase: false });
  });

});
