/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Check that user is on the unauthenticated landing page
     */
    shouldBeOnLandingPage(): Chainable<void>;

    /**
     * Check that Google sign-in UI is properly rendered
     */
    shouldHaveGoogleSignIn(): Chainable<void>;
  }
}
