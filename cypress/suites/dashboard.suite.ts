/// <reference types="cypress" />
import { existingUserLogin } from "support/utils/common";
import { ITestSuite } from "../testSuite";

import { messageText } from "../../src/utils/common/messages";
import { testnetSeedPhrase } from "../.env.js";
import { accountNameTestText, invalidToAddress, validSmallSendQuantity, validToAddress } from "support/utils/constants";

// Goal:
// Overall
// [x] Need to start all tests after logging in (users won't shortcut to dashboard with no account in their state)
// [x] Logging in with an account that does/does not have an alias and testing accordingly

// Addressbook
// [x] Modal should open
// [x] Modal should close by close button
// [x] Modal should close by done button
// [x] Add address button should expose input
// [x] Typing a JUP- address into the input and clicking add should add the address
// [x] Clicking "DEL" button should remove the clicked row
// [x] Entering a duplicate JUP- address should be rejected
// [x] Entering multiple JUP- addresses should work
// [ ] Clicking "SEND" button should open send modal with appropriate address entered in "TO" field
// [x] Entering an invalid address in the "add" input should be rejected

// Send Widget
// [x] Type in valid address and quantity, send button works
// [x] Type in invalid address and valid quantity, send rejected
// [x] Type in an invalid address, send rejected
// [x] Type in valid address, enter testnet seedphrase, test for success
// [ ] Use address book to initiate a send, send widget should populate to address with addressbook address (not implemented yet)

// Settings menu
// [x] Should perform logout when clicked
// [x] About dialog should open when clicked

// UserInfo
// [x] Copy should provide a notification
// [x] Balance copy should provide a notification
// [x] Clicking user name should open user details dialog
// [ ] User info update should provide a notification
// [ ] User info update should update user info after block solve

// Recent blocks widget
// [ ] Confirm block height chip value matches most recent block height in widget
// [ ] Confirm detailed dialog opens
// [ ] Confirm pages can be changed
// [ ] Confirm pages per row can be updated

// My Transactions widget
// [ ] Integrate with a sendwidget send and ensure the result appears in the tx widget?
// [ ] Confirm detailed dialog opens
// [ ] Confirm pages can be changed
// [ ] Confirm pages per row can be updated

// Portfolio widget
// [ ] Confirm send pops up collection dialog
// [ ] Confirm copy ID copies properly
// [ ] Confirm detailed dialog opens

// Dex widget
// [ ] Confirm asset searching works by ID and name
// [ ] Confirm selecting assets reults in orderbook info populating
// [ ] Buy/Sell buttons fire an appropriate collection dialog

// Search component

// Sidebar
// [x] Clicking the hamburger collapses the sidebar
// [x] Clicking it again expands it
// [x] All internal navigation links should...navigate
// [ ] All external navication links should...navigate (problems with this currently, see commented tests below)

export default {
  name: __filename,
  tests: {
    all: () => {
      describe("address book", () => {
        beforeEach(() => {
          cy.visit("/");
          existingUserLogin();
          cy.get("button").contains("Address Book").click();
        });

        it("should open the address book modal", () => {
          cy.get(".MuiDialogActions-root > .MuiButton-root").should("exist");
          cy.get(".MuiDialog-container").should("exist");
        });

        it("should open and close the address book modal using the 'X' button", () => {
          cy.get("button").contains("X").click();

          cy.get(".MuiDialogActions-root > .MuiButton-root").should("not.exist");
          cy.get(".MuiDialog-container").should("not.exist");
        });

        it("should open and close the address book modal using the 'done' button", () => {
          cy.get("button").contains("Done").click();

          cy.get(".MuiDialogActions-root > .MuiButton-root").should("not.exist");
          cy.get(".MuiDialog-container").should("not.exist");
        });

        it("should expose the input when the add button is clicked", () => {
          cy.get("button").contains("+").click();
          cy.get('input[placeholder*="Enter Address"]').should("exist");
        });

        it("should save a JUP- address when entered correctly", () => {
          const testAddy = "JUP-ABCD-ABCD-ABCD-ABCDE";
          cy.get("button").contains("+").click();
          cy.get('input[placeholder*="Enter Address"]').type(testAddy);
          cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force
          cy.get(".MuiTableRow-root").should("contain.text", testAddy);
          cy.get("#notistack-snackbar").should("contain.text", messageText.addressBook.success);
        });

        it("should save a JUP- address when entered correctly and then delete it", () => {
          const testAddy = "JUP-ABCD-ABCD-ABCD-ABCDE";
          cy.get("button").contains("+").click();
          cy.get('input[placeholder*="Enter Address"]').type(testAddy);
          cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force
          cy.get(".MuiTableRow-root").should("contain.text", testAddy);
          cy.get("button").contains("Del").click();
          cy.get(".MuiTableRow-root").should("not.contain.text", testAddy);
          cy.get("#notistack-snackbar").should("contain.text", messageText.addressBook.delete);
        });

        it("should save a JUP- address when entered correctly and reject the same address a second time", () => {
          const testAddy = "JUP-ABCD-ABCD-ABCD-ABCDE";
          cy.get("button").contains("+").click();
          cy.get('input[placeholder*="Enter Address"]').type(testAddy);
          cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force
          cy.get(".MuiTableRow-root").should("contain.text", testAddy);

          // re-add the same address again
          cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force
          cy.get(".MuiTableRow-root").should("contain.text", testAddy);
          cy.get("#notistack-snackbar").should("contain.text", messageText.addressBook.duplicate);
        });

        it("should not save an invalid JUP address", () => {
          cy.get("button").contains("+").click();
          cy.get('input[placeholder*="Enter Address"]').type(invalidToAddress);
          cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force
          cy.get("#notistack-snackbar").should("contain.text", messageText.validation.addressInvalid);
        });

        it("should save multiple JUP- addresses if valid", () => {
          const testAddy1 = "JUP-ABCD-ABCD-ABCD-ABCDE";
          const testAddy2 = "JUP-XXXX-XXXX-XXXX-XXXXX";
          const testAddy3 = "JUP-ZHDA-ERFS-SMFA-PQWZK";

          cy.get("button").contains("+").click();
          cy.get('input[placeholder*="Enter Address"]').type(testAddy1);
          cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force
          cy.get('input[placeholder*="Enter Address"]').clear();

          cy.get('input[placeholder*="Enter Address"]').type(testAddy2);
          cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force
          cy.get('input[placeholder*="Enter Address"]').clear();
          cy.get('input[placeholder*="Enter Address"]').type(testAddy3);
          cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force

          cy.get(".MuiTableRow-root").should("contain.text", testAddy1);
          cy.get(".MuiTableRow-root").should("contain.text", testAddy2);
          cy.get(".MuiTableRow-root").should("contain.text", testAddy3);
          cy.get("#notistack-snackbar").should("contain.text", messageText.addressBook.success);
        });
      });

      describe("send widget", () => {
        beforeEach(() => {
          cy.visit("/");
          existingUserLogin();
        });

        it("should allow send after entering valid address and quantity", () => {
          const testToAddress = validToAddress;
          const testQuantity = validSmallSendQuantity;

          cy.get('input[placeholder*="To Address"]').type(testToAddress);
          cy.get(".css-j8ks8f-MuiStack-root > :nth-child(2) > .MuiInput-input").type(testQuantity);
          cy.get(".css-43mpca-MuiGrid-root > .MuiButton-root").contains("Send").click();

          cy.get(".Mui-error > .MuiInput-input").should("not.exist"); // shouldn't be an error

          // test for display of seed collection window
          cy.get('input[placeholder*="Enter Seed Phrase"]').should("exist");

          // check for snackbar during cancel
          cy.get("button").contains("Done").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.transaction.cancel); // snackbar

          // check for snackbar during failure (no seed entered)
          cy.get(".css-43mpca-MuiGrid-root > .MuiButton-root").contains("Send").click();
          cy.contains("Confirm").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.transaction.failure); // snackbar

          // check for snackbar on successful send
          cy.get(".css-43mpca-MuiGrid-root > .MuiButton-root").contains("Send").click();
          cy.get('input[placeholder*="Enter Seed Phrase"]').type(testnetSeedPhrase);
          cy.contains("Confirm").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.transaction.success); // snackbar
        });

        it("should not allow send after entering an invalid address and valid quantity", () => {
          const badToAddress = invalidToAddress; // address missing one character
          const testQuantity = validSmallSendQuantity;

          cy.get('input[placeholder*="To Address"]').type(badToAddress);
          cy.get(".css-j8ks8f-MuiStack-root > :nth-child(2) > .MuiInput-input").type(testQuantity);
          cy.get("button").contains("Send").click();

          cy.get(".Mui-error > .MuiInput-input").should("exist"); // input should be in error state
          cy.get('input[placeholder*="Enter Seed Phrase"]').should("not.exist"); // seed collection should not.exist
          cy.get("#notistack-snackbar").should("contain.text", "Invalid address"); // snackbar
        });
      });

      describe("user info", () => {
        beforeEach(() => {
          cy.visit("/");
          existingUserLogin();
        });

        // test doesn't work in Firfox
        it("should provide a notification on address copy", () => {
          cy.get(".MuiDrawer-root > .MuiPaper-root > :nth-child(1) > .MuiChip-sizeMedium").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.copy.success); // snackbar
        });

        // test doesn't work in Firfox
        it("should provide a notification on balance copy", () => {
          cy.get(".css-18w7urt-MuiButtonBase-root-MuiChip-root > .MuiChip-label").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.copy.success); // snackbar
        });

        it("should open user info dialog", () => {
          cy.get(".css-v2w70v-MuiButtonBase-root-MuiChip-root > .MuiChip-label").click();
          cy.get(".MuiDialog-container > .MuiPaper-root").should("exist");
        });

        it("should update user info", () => {
          cy.get(".css-v2w70v-MuiButtonBase-root-MuiChip-root > .MuiChip-label").click();
          cy.get(".MuiDialog-container > .MuiPaper-root").should("exist");

          // fragile, assumes the account has no alias set yet and is the default "set name"
          // need to select element in a different way but it's not going to work right now because updateUserInfo
          // needs to be refactored to use useAPIRouter()
          cy.get('input[value*="Set Name"]').type("{selectall}").type(accountNameTestText);
          cy.get("button").contains("Update Account Info").click();
          cy.get('input[placeholder*="Enter Seed Phrase"]').type(testnetSeedPhrase);
          cy.get("button").contains("Confirm & Send").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.userInfo.success); // snackbar
        });
      });

      describe("settings menu", () => {
        const logoutText = "Logout";
        const aboutText = "About";
        beforeEach(() => {
          cy.visit("/");
          existingUserLogin();
        });

        it("should logout properly", () => {
          cy.get(".MuiPaper-root > .MuiToolbar-root > button").last().click();
          cy.contains(logoutText).should("exist");
          cy.contains(logoutText).click();
          cy.get("button").contains("Existing User").should("exist");
        });

        it("should open about dialog", () => {
          cy.get(".MuiPaper-root > .MuiToolbar-root > button").last().click();
          cy.contains(aboutText).should("exist");
          cy.contains(aboutText).click();
        });
      });

      // describe.only("blocks widget", () => {
      //   beforeEach(() => {
      //     cy.visit("/");
      //     existingUserLogin();
      //   });

      //   it("should display the current block", () => {
      //     cy.get(".MuiToolbar-root > .MuiChip-root > .MuiChip-label").should("match", /\d+/gm).as("blockHeight");
      //     cy.get(
      //       ":nth-child(2) > .MuiGrid-root > .MuiPaper-root > .MuiTableContainer-root > .MuiTable-root > .MuiTableBody-root > :nth-child(1) > :nth-child(1)"
      //     ).then(($blockHeightElement) => {
      //       const currentHeight = $blockHeightElement.text();
      //       alert(currentHeight);
      //     });
      //   });
      // });

      describe("sidebar", () => {
        beforeEach(() => {
          cy.visit("/");
          existingUserLogin();
        });

        it("should collapse sidebar and re-display it", () => {
          // collapse sidebar
          cy.get(".MuiPaper-root > .MuiToolbar-root > button").first().click();
          cy.get(".MuiDrawer-root > .MuiPaper-root").should("not.be.visible");

          // expand it
          cy.get(".MuiPaper-root > .MuiToolbar-root > button").first().click().scrollIntoView();
          cy.get(".MuiDrawer-root > .MuiPaper-root").should("be.visible");
        });

        it("dashboard navigation should work", () => {
          // navigate away first
          cy.get('[href="/portfolio"] > .MuiButtonBase-root').click();

          // then come back
          cy.get('[href="/dashboard"] > .MuiButtonBase-root').click();
          cy.url().should("include", "dashboard");
        });

        it("transactions navigation should work", () => {
          cy.get('[href="/transactions"] > .MuiButtonBase-root').click();
          cy.url().should("include", "transactions");
        });

        it("exchange navigation should work", () => {
          cy.get('[href="/exchange"] > .MuiButtonBase-root').click();
          cy.url().should("include", "exchange");
        });

        it("portfolio navigation should work", () => {
          cy.get('[href="/portfolio"] > .MuiButtonBase-root').click();
          cy.url().should("include", "portfolio");
        });

        // still figuring out new window testing
        //  could work: https://stackoverflow.com/questions/47749956/access-a-new-window-cypress-io
        //
        // it.only("Handling new Browser Window", function () {
        //   cy.window().then((win) => {

        //     cy.stub(win, "open").callsFake((url) => {
        //       win.location.href = "https://twitter.com/JUP_Project";
        //     }).as("popup");

        //   });
        //   cy.get('[href="https://twitter.com/JUP_Project"] > .MuiButtonBase-root').click();
        //   cy.get("@popup").should("be.called");
        //   cy.url().should("include", "JUP_Project");
        // });

        // it.only("Twitter navigation should work", () => {
        //   cy.get('[href="https://twitter.com/JUP_Project"] > .MuiButtonBase-root').click();

        //   cy.intercept("https://twitter.com/JUP_Project").as("twitter");

        //   cy.wait("@twitter").its("request.url").should("contain", "billybob");
        // });

        // it.only("Blog navigation should work", () => {
        //   cy.get('[href="https://blog.gojupiter.tech/"] > .MuiButtonBase-root').click();
        //   cy.url().should("include", "blog.gojupiter.tech");
        // });

        // it.only("Main site navigation should work", () => {
        //   cy.get('[href="https://jup.io/"] > .MuiButtonBase-root').click();
        //   cy.url().should("include", "jup.io");
        // });

        // it.only("Metis navigation should work", () => {
        //   cy.get('[href="https://jup.io/metis-messenger"] > .MuiButtonBase-root').click();
        //   cy.url().should("include", "jup.io/metis-messenger");
        // });

        // it.only("Leda navigation should work", () => {
        //   cy.get('[href="https://leda.jup.io/"] > .MuiButtonBase-root').click();
        //   cy.url().should("include", "leda.jup.io/");
        // });
      });
    },
    xs: () => {},
    sm: () => {},
    md: () => {},
    lg: () => {},
  },
} as ITestSuite;
