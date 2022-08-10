/// <reference types="cypress" />
import { existingUserLogin, expectClickExistingUserButton } from "support/utils/common";
import { unusedLoginAddress } from "support/utils/constants";
import { ITestSuite } from "../testSuite";

// Goal:
// [x] compare one generation of seed phrases to another generation of seed phrases and ensure they are different
// [x] input the proper seed phrases by clicking the chips
// [x] input the seed phrases by clicking the chips, and revert at least once by clicking the last chip again (wrong or right chip click)
// [x] try to put in the seed phrases and then unclick a chip that wasn't the last chip, expect the chip to not 'switch'
// [x] input all seed phrases and then undo all of them in order, checking for edge cases
// [x] check successful re-entry, remember me click and land on dashboard with local storage set
// [x] click 'existing user' and 'type' in a valid JUP- wallet address
// [x] re-enter a seedphrase incorrectly and ensure the warning is accurate to force the user to try again
// [x] integrate the new checkboxes with all of the tests
// [x] review the coverage reports for further test changes
// [x] perform all tests in mobile size
// [x] from the login page attempt to manually browse to another page and ensure the Private component blocks it properly by redirecting
// [x] click 'existing user' and choose a remembered address from session
// [x] click 'existing user' and 'type' in an invalid JUP- wallet address
// [x] copy the generated seed to clipboard and verify it copied correctly -- attempted, challenging currently due to browser security
// [x] progress all the way through the new user onboarding process and use the "back" button to return to the first step
// [ ] re-enter a seedphrase correctly, then enter it incorrectly and ensure the warning appears, then re-enter it correctly again
// [ ] don't click both understand "ack" boxes on the Display Address step, or remove that code now that we conditionally render the login button

export default {
  name: __filename,
  tests: {
    all: () => {
      beforeEach(() => {
        cy.visit("/"); // each test starts at the root (login) page
      });

      it("should not allow navigation away from the login page if the user isn't logged in", () => {
        cy.visit("/dashboard");
        cy.url().should("eq", "http://localhost:3002/");
        cy.visit("/portfolio");
        cy.url().should("eq", "http://localhost:3002/");
      });

      it("should generate two seed phrases and they are different", () => {
        expectClickGenerateWalletButton();

        const handleSecondSeed = (firstSeed) => {
          cy.get("button").get('[aria-label="Regenerate Seed"]').click();
          cy.get("textarea")
            .invoke("val")
            .then((secondSeed) => {
              expect(firstSeed).not.to.eq(secondSeed);

              cy.wrap(stringToWordArray(firstSeed)).its("length").should("eq", 12);
              cy.wrap(stringToWordArray(secondSeed)).its("length").should("eq", 12);
            });
        };

        cy.get("textarea").invoke("val").then(handleSecondSeed);
      });

      // ignoring this lint warning because this test was only intended to prove duplicate seed words could exist
      // so it doesn't need to run during development
      /* eslint-disable-next-line jest/no-disabled-tests */
      it.skip("should generate a bunch of seed phrases and check for duplicates", () => {
        expectClickGenerateWalletButton();

        Cypress._.times(1000, () => {
          cy.get("button").get('[aria-label="Regenerate Seed"]').click();
          cy.get("textarea")
            .invoke("val")
            .then((firstSeed) => {
              cy.wrap(stringToWordArray(firstSeed)).as("firstSeed");

              cy.get("@firstSeed").each((word, index, seedWords) => {
                expect(seedWords.includes(word as unknown as HTMLElement, index + 1)).to.be.false;
              });

              cy.get("@firstSeed").its("length").should("eq", 12);
            });
        });
      });

      // this test only works in electrum
      it("should allow the user to copy the seed to clip board", () => {
        expectClickGenerateWalletButton();

        cy.get("button").get('[aria-label="Copy Seed"]').click();

        cy.get("textarea")
          .invoke("val")
          .then((seedPhrase) => {
            if (seedPhrase === undefined || typeof seedPhrase === "number" || Array.isArray(seedPhrase)) {
              return " ";
            }
            return seedPhrase.trim().replace(/\n/g, " ");
          })
          .then((seedPhrase) => cy.window().its("navigator.clipboard").invoke("readText").should("equal", seedPhrase));
      });

      /* eslint-disable-next-line mocha-cleanup/asserts-limit */
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

      /* eslint-disable-next-line mocha-cleanup/asserts-limit */
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

      /* eslint-disable-next-line mocha-cleanup/asserts-limit */
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

      /* eslint-disable-next-line mocha-cleanup/asserts-limit */
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

      it("should do re-entry incorrectly and display the appropriate message", () => {
        expectClickGenerateWalletButton();

        cy.get("textarea").invoke("val").then(stringToWordArray).as("seedWords");
        cy.get("label").contains("I have backed up my seed phrase").click();
        cy.get(".MuiChip-label").click({ multiple: true }); //serially click each returned element rather than click them in the original order

        cy.get(".MuiAlert-message").contains("Incorrect seed re-entry, please double check your seed.").should("exist");
      });

      /* eslint-disable-next-line mocha-cleanup/asserts-limit */
      it("should enter a valid JUP address as an Existing User and be able to login with it after remembering", () => {
        existingUserLogin();

        expectToBeOnDashboard(true);

        cy.visit("/");
        cy.get(".MuiAutocomplete-input").click().type("{downArrow}{enter}"); // uses down arrow and enter button to select the first account
        cy.get("button").contains("Login").click();

        expectToBeOnDashboard(true);
      });

      /* eslint-disable-next-line mocha-cleanup/asserts-limit */
      it("should enter an invalid JUP address as an Existing user", () => {
        expectClickExistingUserButton();

        cy.get(".MuiAutocomplete-input").type("JUP-QUXP-4HAG-XHW3-9CDQ"); // real address but missing a character
        cy.get(".MuiAlert-message").contains("Invalid address format, please check your address and re-enter it.");
      });

      /* eslint-disable-next-line mocha-cleanup/asserts-limit */
      it("should allow login with an account that has no public key yet", () => {
        expectClickExistingUserButton();

        cy.get(".MuiAutocomplete-input").type(unusedLoginAddress); // real address but missing a character
        cy.get("button").contains("Login").click();
        expectToBeOnDashboard();
      });

      /* eslint-disable-next-line mocha-cleanup/asserts-limit */
      it.only("should allow a user to go back to the beginning from any step", () => {
        // go to second step
        expectClickGenerateWalletButton();
        cy.get("#onboarding_back_button").trigger("click");

        // go to third step
        expectClickGenerateWalletButton();
        cy.get("textarea").invoke("val").then(stringToWordArray).as("seedWords");
        cy.get("label").contains("I have backed up my seed phrase").click();
        cy.get("#onboarding_back_button").trigger("click");

        // go to final step
        cy.get("textarea").invoke("val").then(stringToWordArray).as("seedWords");
        cy.get("label").contains("I have backed up my seed phrase").click();
        reEnterSeedWordsCorrectly();
        cy.get("button").contains("Continue").click();
        cy.get("#onboarding_back_button").trigger("click");

        // finish login
        reEnterSeedWordsCorrectly();
        expectToGoToDashboard();
      });

      //
      // Helper functions
      //

      function stringToWordArray(text) {
        return new Cypress.Promise((resolve) => {
          cy.log("converting string: " + text);
          resolve(text.replace(/\n/g, " ").split(" "));
        });
      }

      function expectClickGenerateWalletButton() {
        return cy.get("button").contains("Generate Wallet").click();
      }

      function expectNofLWordReEnteredWords(n, l) {
        return cy.get(".MuiAlert-message").contains(`Re-Entered Words (${n} of ${l})`).should("exist");
      }

      function reEnterSeedWordsCorrectly() {
        cy.get("@seedWords").each((word, index, seedWords) => {
          cy.get(".MuiChip-label")
            .contains(word as unknown as string)
            .click();

          if (index + 1 < seedWords.length) {
            expectNofLWordReEnteredWords(index + 1, seedWords.length);
          }
        });
      }

      function expectSeedsCorrectlyEntered() {
        cy.get(".MuiAlert-message").contains("Seed correctly re-entered, you may now proceed.").should("exist");
      }

      function expectToGoToDashboard(checkRememberMe?: boolean) {
        expectSeedsCorrectlyEntered();
        cy.get("button").contains("Continue").click();
        cy.get(".MuiTypography-root").contains("Here is your Jupiter address:").should("exist");

        // clicks the two understand checkboxes
        cy.get(".MuiAlert-standardSuccess > .MuiAlert-message > .MuiCheckbox-root > .PrivateSwitchBase-input").click();
        cy.get(".MuiAlert-standardWarning > .MuiAlert-message > .MuiCheckbox-root > .PrivateSwitchBase-input").click();

        if (checkRememberMe) {
          cy.get("label").contains("Remember Account?").click();
        }

        cy.get("button").contains("Go To Dashboard").should("exist").click();

        expectToBeOnDashboard(checkRememberMe);
      }

      function expectToBeOnDashboard(checkRememberMe?: boolean) {
        cy.get(".MuiTypography-root")
          .contains("Jupiter Wallet")
          .should("exist")
          .then(() => {
            if (checkRememberMe) {
              const local = localStorage.getItem("accounts");
              expect(local).to.not.eq(null);

              if (local === null) {
                throw new Error('"accounts" local storage null!');
              }
              const accounts = JSON.parse(local);
              expect(accounts.length).to.eq(1);
              expect(accounts[0]).to.contains("JUP-");
            }
          });
      }
    },
    xs: () => {},
    sm: () => {},
    md: () => {},
    lg: () => {},
  },
} as ITestSuite;
