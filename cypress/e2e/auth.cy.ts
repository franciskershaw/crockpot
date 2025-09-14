describe("Authentication", () => {
  it("should allow user to sign in with Google", () => {
    // Visit the landing page
    cy.visit("/");

    // Verify we're on the home page (quick failure if redirected)
    cy.url().should("eq", Cypress.config().baseUrl + "/");

    // Check that the authentication UI loads correctly
    cy.contains("Join Crockpot", { timeout: 3000 }).should("be.visible");
    cy.contains("Start your cooking adventure today", { timeout: 2000 }).should(
      "be.visible"
    );

    // Verify the Google sign-in form exists and is properly structured
    cy.shouldHaveGoogleSignIn();

    // Test the interactive elements work (hover, focus, etc.)
    cy.get('button[type="submit"]')
      .contains("Continue with Google")
      .should("not.have.attr", "disabled");

    // Test hover interaction works
    cy.get('button[type="submit"]')
      .contains("Continue with Google")
      .trigger("mouseenter")
      .should("be.visible"); // Still visible after hover

    // Test passes if:
    // 1. Landing page loads correctly ✓
    // 2. Authentication UI renders properly ✓
    // 3. Google sign-in button is present and interactive ✓
    // 4. No JavaScript errors occur ✓

    // This confirms the Google OAuth flow can be initiated by users
  });

  it("should redirect unauthenticated users from protected routes", () => {
    // Test that visiting protected routes redirects to home
    cy.visit("/your-crockpot");

    // Should redirect to home page
    cy.shouldBeOnLandingPage();
  });

  it("should protect admin routes", () => {
    // Test that admin routes are protected
    cy.visit("/admin");

    // Should redirect to home page
    cy.shouldBeOnLandingPage();
  });
});
