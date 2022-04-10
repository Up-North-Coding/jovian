/// <reference types="cypress" />

// Goal:
// x compare one generation of seed phrases to another generation of seed phrases and ensure they are different
// x input the proper seed phrases by clicking the chips
// x input the seed phrases by clicking the chips, and revert at least once by clicking the last chip again (wrong or right chip click)
// x try to put in the seed phrases and then unclick a chip that wasn't the last chip, expect the chip to not 'switch'
// x input all seed phrases and then undo all of them in order, checking for edge cases
// x check successful re-entry, remember me click and land on dashboard with local storage set
// - click 'existing user' and 'type' in a valid JUP- wallet address

describe("login page", () => {
  Cypress.Promise.onPossiblyUnhandledRejection((error, promise) => {
    throw error;
  });

  beforeEach(() => {
    // setup each test to be on the Step #2, Backup Seed
    cy.visit("/");
  });

  it("should generate two different seed phrases and they are different", () => {
    expectClickGenerateWalletButton();

    const handleSecondSeed = (firstSeed) => {
      cy.get("button").get('[aria-label="Regenerate Seed"]').click(); // regenerate seed button
      cy.get("textarea")
        .invoke("val")
        .then((secondSeed) => {
          expect(firstSeed).not.to.eq(secondSeed);

          cy.wrap(stringToWordArray(firstSeed)).should("have.length", 12);
          cy.wrap(stringToWordArray(secondSeed)).should("have.length", 12);
        });
    };

    cy.get("textarea").invoke("val").then(handleSecondSeed);
  });

  it("should generate and enter a proper seed phrase", () => {
    expectClickGenerateWalletButton();
    cy.get("textarea").invoke("val").then(stringToWordArray).as("seedWords");

    cy.get("label").contains("I have backed up my seed phrase").click();

    cy.get("@seedWords").each((word, index, seedWords) => {
      cy.get(".MuiChip-label")
        .contains(word as unknown as string)
        .click();

      if (index + 1 < seedWords.length) {
        expectNofLWordReEnteredWords(index + 1, seedWords.length);
      }
    });

    expectToGoToDashboard();
  });

  it("should generate and enter a proper seed phrase but revert on one word during re-entry", () => {
    expectClickGenerateWalletButton();

    cy.get("textarea").invoke("val").then(stringToWordArray).as("seedWords");
    cy.get("label").contains("I have backed up my seed phrase").click();

    const REVERT_NUMBER = 5;

    cy.get("@seedWords").each((word, index, seedWords) => {
      cy.get(".MuiChip-label")
        .contains(word as unknown as string)
        .click();

      if (index + 1 === REVERT_NUMBER) {
        expectNofLWordReEnteredWords(index + 1, seedWords.length);
        cy.get(".MuiChip-label")
          .contains(word as unknown as string)
          .click();
        expectNofLWordReEnteredWords(index, seedWords.length);
        cy.get(".MuiChip-label")
          .contains(word as unknown as string)
          .click();
        expectNofLWordReEnteredWords(index + 1, seedWords.length);
      }
    });

    expectToGoToDashboard();
  });

  it("should generate and enter a proper seed phrase but revert a word during re-entry that isn't the last", () => {
    expectClickGenerateWalletButton();

    cy.get("textarea").invoke("val").then(stringToWordArray).as("seedWords");
    cy.get("label").contains("I have backed up my seed phrase").click();

    const INCORRECT_NUMBER = 3;
    const REVERT_NUMBER = 5;

    cy.get("@seedWords").each((word, index, seedWords) => {
      cy.get(".MuiChip-label")
        .contains(word as unknown as string)
        .click();

      if (index + 1 < seedWords.length) {
        expectNofLWordReEnteredWords(index + 1, seedWords.length);
      }

      if (index + 1 === REVERT_NUMBER) {
        cy.get(".MuiChip-label")
          .contains(seedWords[INCORRECT_NUMBER] as unknown as string)
          .click();
        expectNofLWordReEnteredWords(index + 1, seedWords.length);
      }
    });

    expectToGoToDashboard();
  });

  it("should check successful re-entry, remember me click and land on dashboard with local storage set", () => {
    expectClickGenerateWalletButton();

    cy.get("textarea").invoke("val").then(stringToWordArray).as("seedWords");
    cy.get("label").contains("I have backed up my seed phrase").click();

    cy.get("@seedWords").each((word, index, seedWords) => {
      cy.get(".MuiChip-label")
        .contains(word as unknown as string)
        .click();

      if (index + 1 < seedWords.length) {
        expectNofLWordReEnteredWords(index + 1, seedWords.length);
      }
    });

    expectToGoToDashboard(true);
  });

  it("should enter a valid JUP address as an Existing User", () => {
    expectClickExistingUserButton();

    cy.get(".MuiAutocomplete-input").type("JUP-ABCD-ABCD-ABCD-ABCDE");
    cy.get("label").contains("Remember Account?").click();
    cy.get("button").contains("Login").click();

    expectToBeOnDashboard(true);
  });

  //
  // Helper functions
  //

  function stringToWordArray(text) {
    return new Cypress.Promise((resolve, reject) => {
      cy.log("converting string: " + text);
      resolve(text.replace(/\n/g, " ").split(" "));
    });
  }

  function expectClickExistingUserButton() {
    cy.get("button").contains("Existing User").click();
  }

  function expectClickGenerateWalletButton() {
    return cy.get("button").contains("Generate Wallet").click();
  }

  function expectNofLWordReEnteredWords(n, l) {
    return cy.get(".MuiAlert-message").contains(`Re-Entered Words (${n} of ${l})`).should("exist");
  }

  function expectSeedsCorrectlyEntered() {
    cy.get(".MuiAlert-message").contains("Seed correctly re-entered, you may now proceed.").should("exist");
  }

  function expectToGoToDashboard(checkRememberMe?: boolean) {
    expectSeedsCorrectlyEntered();
    cy.get("button").contains("Continue").click();
    cy.get(".MuiTypography-root").contains("Here is your Jupiter address:").should("exist");
    if (checkRememberMe) {
      cy.get("label").contains("Remember Account?").click();
    }
    cy.get("button").contains("Go To Dashboard").should("exist").click();

    expectToBeOnDashboard(checkRememberMe);
  }

  function expectToBeOnDashboard(checkRememberMe?: boolean) {
    cy.get(".MuiTypography-root")
      .contains("ITS A DASHBOARD")
      .should("exist")
      .then(() => {
        if (checkRememberMe) {
          const accounts = JSON.parse(localStorage.getItem("accounts"));
          expect(accounts.length).to.eq(1);
          expect(accounts[0]).to.contains("JUP-");
        }
      });
  }
});
