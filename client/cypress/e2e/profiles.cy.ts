/// <reference types="cypress" />

import { API_ROOT } from "../../src/lib/constants";
import { PAGES } from '../../src/types/index';
import { LOCALHOST_BACKEND_URL, user } from "../constants";

describe('Profiles', () => {
  beforeEach(() => {
    cy.request('DELETE', `${LOCALHOST_BACKEND_URL}/${API_ROOT}/users`);
    cy.request('POST', `${LOCALHOST_BACKEND_URL}/${API_ROOT}/users`);

    cy.visit(PAGES.LOGIN);
    cy.get('input[name="email"]').type(user.email);
    cy.get('input[name="email"]').should('have.value', user.email);

    cy.get('input[name="password"]').type(user.password);
    cy.get('input[name="password"]').should('have.value', user.password);

    cy.get('button').contains('Sign In').click();
    
    cy.get('button').contains(user.username).click();
    cy.get('a').contains('Profile').click();
  });

});
