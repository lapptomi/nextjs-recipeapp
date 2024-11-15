/// <reference types="cypress" />

import { PAGES } from "../../src/types/index";
import { LOCALHOST_BACKEND_URL, user } from "../constants";

describe("Login", () => {
  beforeEach(() => {
    cy.request("DELETE", `${LOCALHOST_BACKEND_URL}/users`);
    cy.request("POST", `${LOCALHOST_BACKEND_URL}/users`, user);
    cy.visit(PAGES.LOGIN);
  });

  it("Should visit", () => {
    cy.visit(PAGES.LOGIN);
  });

  it("Displays error message on invalid login", () => {
    cy.get('input[name="email"]').type("invalidemail");
    cy.get('input[name="email"]').should("have.value", "invalidemail");

    cy.get('input[name="password"]').type("invalid");
    cy.get('input[name="password"]').should("have.value", "invalid");

    cy.get("button").contains("Sign In").click();

    cy.contains("Invalid or missing credentials");
  });

  it("Redirects to recipes on valid login", () => {
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="email"]').should("have.value", user.email);

    cy.get('input[name="password"]').type(user.password);
    cy.get('input[name="password"]').should("have.value", user.password);

    cy.get("button").contains("Sign In").click();

    cy.url().should("include", PAGES.RECIPES);
  });
});
