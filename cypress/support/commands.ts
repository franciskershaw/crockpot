/// <reference types="cypress" />

// Custom commands for Crockpot authentication testing

/**
 * Check that user is on the unauthenticated landing page
 */
Cypress.Commands.add("shouldBeOnLandingPage", () => {
  cy.url().should("eq", Cypress.config().baseUrl + "/");
  cy.contains("Join Crockpot", { timeout: 3000 }).should("be.visible");
});

/**
 * Check that Google sign-in UI is properly rendered
 */
Cypress.Commands.add("shouldHaveGoogleSignIn", () => {
  cy.get("form").should("exist");
  cy.get('form button[type="submit"]')
    .contains("Continue with Google")
    .should("be.visible")
    .should("be.enabled");
});

// Type definitions are in index.d.ts
