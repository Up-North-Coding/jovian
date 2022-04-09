// Goal:
// x compare one generation of seed phrases to another generation of seed phrases and ensure they are different
// x input the proper seed phrases by clicking the chips
// x input the seed phrases by clicking the chips, and revert at least once by clicking the last chip again (wrong or right chip click)
// x try to put in the seed phrases and then unclick a chip that wasn't the last chip, expect the chip to not 'switch'
// x input all seed phrases and then undo all of them in order, checking for edge cases
// x check successful re-entry, remember me click and land on dashboard with local storage set
// - click 'existing user' and 'type' in a valid JUP- wallet address

beforeEach(() => {
  // setup each test to be on the Step #2, Backup Seed
  cy.visit("/");
});

it("should generate two different seed phrases and they are different", () => {
  expectClickGenerateWalletButton();
  const handleSecondSeed = (firstSeed) => {
    cy.get("button").get('[aria-label="Regenerate Seed"]').click(); // perform the regen
    cy.get("textarea")
      .invoke("val")
      .then((secondSeed) => {
        expect(firstSeed).not.to.eq(secondSeed);
      });
  };

  cy.get("textarea").invoke("val").then(handleSecondSeed);
});

it("should generate and enter a proper seed phrase", () => {
  expectClickGenerateWalletButton();
  cy.get("textarea")
    .invoke("val")
    .then((seedPhrase) => {
      cy.get("label").contains("I have backed up my seed phrase").click();

      expectClickReEntryChipsCorrectly(seedPhrase);
      expectToGoToDashboard();
    });
});

it("should generate and enter a proper seed phrase but revert on one word during re-entry", () => {
  expectClickGenerateWalletButton();
  cy.get("textarea")
    .invoke("val")
    .then((seedPhrase) => {
      cy.get("label").contains("I have backed up my seed phrase").click();

      const words = stringToWordArray(seedPhrase);
      const REVERT_NUMBER = 5;
      let current_number = 0;
      for (let word of words) {
        cy.get(".MuiChip-label").contains(word).click();

        current_number++;
        if (current_number === REVERT_NUMBER) {
          expectNofLWordReEnteredWords(current_number, words.length);
          cy.get(".MuiChip-label").contains(word).click();
          expectNofLWordReEnteredWords(current_number - 1, words.length);
          cy.get(".MuiChip-label").contains(word).click();
          expectNofLWordReEnteredWords(current_number, words.length);
        }
      }

      expectToGoToDashboard();
    });
});

it("should generate and enter a proper seed phrase but revert a word during re-entry that isn't the last", () => {
  expectClickGenerateWalletButton();
  cy.get("textarea")
    .invoke("val")
    .then((seedPhrase) => {
      cy.get("label").contains("I have backed up my seed phrase").click();

      const words = stringToWordArray(seedPhrase);
      const REVERT_NUMBER = 5;
      const INCORRECT_NUMBER = 3; // incorrect word to click
      let current_number = 0;
      for (let word of words) {
        cy.get(".MuiChip-label").contains(word).click();

        current_number++;
        if (current_number === REVERT_NUMBER) {
          expectNofLWordReEnteredWords(current_number, words.length);
          cy.get(".MuiChip-label").contains(words[INCORRECT_NUMBER]).click();
          expectNofLWordReEnteredWords(current_number, words.length);
        }
      }

      expectToGoToDashboard();
    });
});

it("should generate and enter a proper seed phrase but revert all of them in order", () => {
  expectClickGenerateWalletButton();
  cy.get("textarea")
    .invoke("val")
    .then((seedPhrase) => {
      cy.get("label").contains("I have backed up my seed phrase").click();

      expectClickReEntryChipsCorrectly(seedPhrase);
      expectSeedsCorrectlyEntered();

      const undoWords = stringToWordArray(seedPhrase).reverse();
      let current_number = undoWords.length;
      for (let undo of undoWords) {
        cy.get(".MuiChip-label").contains(undo).click();

        if (current_number > 0) {
          expectNofLWordReEnteredWords(current_number - 1, undoWords.length);
        }
        current_number--;
      }

      expectNofLWordReEnteredWords(0, undoWords.length);
      expectClickReEntryChipsCorrectly(seedPhrase);
      expectToGoToDashboard();
    });
});

it("should check successful re-entry, remember me click and land on dashboard with local storage set", () => {
  expectClickGenerateWalletButton();
  cy.get("textarea")
    .invoke("val")
    .then((seedPhrase) => {
      cy.get("label").contains("I have backed up my seed phrase").click();

      expectClickReEntryChipsCorrectly(seedPhrase);
      expectToGoToDashboard(true);
    });
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
  cy.log("converting string: " + text);
  return text.replace(/\n/g, " ").split(" ");
}

function expectClickGenerateWalletButton() {
  cy.get("button").contains("Generate Wallet").click();
}

function expectClickExistingUserButton() {
  cy.get("button").contains("Existing User").click();
}

function expectSeedsCorrectlyEntered() {
  cy.get(".MuiAlert-message").contains("Seed correctly re-entered, you may now proceed.").should("exist");
}

function expectToGoToDashboard(checkRememberMe) {
  expectSeedsCorrectlyEntered();
  cy.get("button").contains("Continue").click();
  cy.get(".MuiTypography-root").contains("Here is your Jupiter address:").should("exist");
  if (checkRememberMe) {
    cy.get("label").contains("Remember Account?").click();
  }
  cy.get("button").contains("Go To Dashboard").should("exist").click();

  expectToBeOnDashboard(checkRememberMe);
}

function expectToBeOnDashboard(checkRememberMe) {
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

function expectNofLWordReEnteredWords(n, l) {
  cy.get(".MuiAlert-message").contains(`Re-Entered Words (${n} of ${l})`).should("exist");
}

function expectClickReEntryChipsCorrectly(seedPhrase) {
  const words = stringToWordArray(seedPhrase);
  let current_number = 0;
  for (let word of words) {
    cy.get(".MuiChip-label").contains(word).click();
    current_number++;
    if (current_number < words.length) {
      expectNofLWordReEnteredWords(current_number, words.length);
    }
  }
}
