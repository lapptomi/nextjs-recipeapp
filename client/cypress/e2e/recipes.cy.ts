/// <reference types="cypress" />

import { ROUTES } from "../../src/types/index";
import { LOCALHOST_BACKEND_URL, recipe, user } from "../constants";

describe("Recipes", () => {
  beforeEach(() => {
    cy.request("DELETE", `${LOCALHOST_BACKEND_URL}/users`);
    cy.request("POST", `${LOCALHOST_BACKEND_URL}/users`, user);

    cy.visit(ROUTES.LOGIN);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="email"]').should("have.value", user.email);

    cy.get('input[name="password"]').type(user.password);
    cy.get('input[name="password"]').should("have.value", user.password);

    cy.get("button").contains("Sign In").click();
    cy.contains(user.username, { matchCase: false });
  });

  it('Renders "No recipes found" when database doesnt contain recipes', () => {
    cy.contains("No recipes found");
  });

  it("Can be created with correct data", () => {
    cy.visit(ROUTES.CREATE_RECIPE);

    cy.get('input[name="title"]').type(recipe.title);
    cy.get('input[name="title"]').should("have.value", recipe.title);

    cy.get('input[name="description"]').type(recipe.description);
    cy.get('input[name="description"]').should("have.value", recipe.description);

    cy.get('textarea[name="instructions"]').type(recipe.instructions);
    cy.get('textarea[name="instructions"]').should("have.value", recipe.instructions);

    cy.get("button").contains("Submit").click();

    cy.contains("Test recipe", { matchCase: false });
    cy.contains("Test description", { matchCase: false });
    cy.contains("Test instructions", { matchCase: false });
  });

  it("Can be commented on", () => {
    cy.visit(ROUTES.CREATE_RECIPE);

    cy.get('input[name="title"]').type(recipe.title);
    cy.get('input[name="title"]').should("have.value", recipe.title);

    cy.get('input[name="description"]').type(recipe.description);
    cy.get('input[name="description"]').should("have.value", recipe.description);

    cy.get('textarea[name="instructions"]').type(recipe.instructions);
    cy.get('textarea[name="instructions"]').should("have.value", recipe.instructions);

    cy.get("button").contains("Submit").click();

    cy.contains("Test recipe", { matchCase: false });
    cy.contains("Test description", { matchCase: false });
    cy.contains("Test instructions", { matchCase: false });

    cy.get('textarea[name="message"]').type("Test comment");
    cy.get('textarea[name="message"]').should("have.value", "Test comment");

    cy.get("#comment-button").click();

    cy.contains("Test comment", { matchCase: false });
  });

  it("Can be liked", () => {
    cy.visit(ROUTES.CREATE_RECIPE);

    cy.get('input[name="title"]').type(recipe.title);
    cy.get('input[name="title"]').should("have.value", recipe.title);

    cy.get('input[name="description"]').type(recipe.description);
    cy.get('input[name="description"]').should("have.value", recipe.description);

    cy.get('textarea[name="instructions"]').type(recipe.instructions);
    cy.get('textarea[name="instructions"]').should("have.value", recipe.instructions);

    cy.get("button").contains("Submit").click();

    cy.contains("Test recipe", { matchCase: false });
    cy.contains("Test description", { matchCase: false });
    cy.contains("Test instructions", { matchCase: false });

    cy.get("#like-button").click();
    cy.get('[data-testid="like-count"]').should("have.text", "1");
  });

  it("Can be disliked", () => {
    cy.visit(ROUTES.CREATE_RECIPE);

    cy.get('input[name="title"]').type(recipe.title);
    cy.get('input[name="title"]').should("have.value", recipe.title);

    cy.get('input[name="description"]').type(recipe.description);
    cy.get('input[name="description"]').should("have.value", recipe.description);

    cy.get('textarea[name="instructions"]').type(recipe.instructions);
    cy.get('textarea[name="instructions"]').should("have.value", recipe.instructions);

    cy.get("button").contains("Submit").click();

    cy.contains("Test recipe", { matchCase: false });
    cy.contains("Test description", { matchCase: false });
    cy.contains("Test instructions", { matchCase: false });

    cy.get("#dislike-button").click();
    cy.get('[data-testid="dislike-count"]').should("have.text", "1");
  });
});
