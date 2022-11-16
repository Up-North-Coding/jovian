/// <reference types="cypress" />
import { addAddressToAddressbook, existingUserLogin } from "support/utils/common";
import { ITestSuite } from "../testSuite";

import { messageText } from "../../src/utils/common/messages";
import { testnetSeedPhrase } from "../.env.js";
import * as Constants from "support/utils/constants";

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
// [x] Entering an invalid address in the "add" input should be rejected

// Send Widget
// [x] Type in valid address and quantity, send button works
// [x] Type in invalid address and valid quantity, send rejected
// [x] Type in an invalid address, send rejected
// [x] Type in valid address, enter testnet seedphrase, test for success

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
// [x] Confirm block height chip value matches most recent block height in widget
// [x] Confirm detailed dialog opens
// [ ] Confirm pages can be changed (having a hard time implementing)
// [x] Confirm pages per row can be updated
// [x] Full page nav works

// My Transactions widget
// [ ] Integrate with a sendwidget send and ensure the result appears in the tx widget?
// [ ] Confirm detailed dialog opens
// [ ] Confirm pages can be changed
// [x] Confirm pages per row can be updated
// [x] Full page nav works

// Portfolio widget
// [x] Confirm send pops up collection dialog
// [x] Confirm copy ID copies properly
// [ ] Confirm detailed dialog opens (not implemented)
// [x] Confirm send asset can be done properly
// [x] Confirm transaction cancellation works
// [ ] Confirm pages can be changed
// [x] Confirm pages per row can be updated
// [x] Full page nav works

// Dex widget
// [x] Confirm asset searching works by ID and name
// [x] Confirm selecting assets results in orderbook info populating
// [x] Buy/Sell buttons don't fire a collection dialog if there's incomplete data
// [x] Buy/Sell buttons fire an appropriate collection dialog
// [x] Transaction cancellation fires the appropriate snackbar
// [-] Buy/Sell buttons perform an order placement properly (test written but has a flaw)

// Search component
// [ ] Not implemented yet

// Sidebar
// [x] Clicking the hamburger collapses the sidebar
// [x] Clicking it again expands it
// [x] All internal navigation links should...navigate
// [x] All external navication links should...navigate

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

        it("should open and close the address book modal using the 'X' button", () => {
          cy.get(".MuiDialogActions-root > .MuiButton-root").should("exist");
          cy.get(".MuiDialog-container").should("exist");
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

        it("should save a JUP- address when entered correctly and then delete it", () => {
          cy.get("button").contains("+").click();
          addAddressToAddressbook(Constants.validAddress);
          cy.get(".MuiTableRow-root").should("contain.text", Constants.validAddress);
          cy.get("#notistack-snackbar").should("contain.text", messageText.addressBook.success);
          cy.get("button").contains("Del").click();
          cy.get(
            ".MuiDialogContent-root > .MuiPaper-root > .MuiTableContainer-root > .MuiTable-root > .MuiTableBody-root > .MuiTableRow-root > :nth-child(1)"
          ).should("not.exist");
          cy.get("#notistack-snackbar").should("contain.text", messageText.addressBook.delete);
        });

        it("should save a JUP- address when entered correctly and reject the same address a second time", () => {
          cy.get("button").contains("+").click();
          addAddressToAddressbook(Constants.validAddress);
          cy.get(".MuiTableRow-root").should("contain.text", Constants.validAddress);

          // re-add the same address again
          cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force
          cy.get(".MuiTableRow-root").should("contain.text", Constants.validAddress);
          cy.get("#notistack-snackbar").should("contain.text", messageText.addressBook.duplicate);
        });

        it("should not save an invalid JUP address", () => {
          cy.get("button").contains("+").click();
          addAddressToAddressbook(Constants.invalidToAddress);
          cy.get("#notistack-snackbar").should("contain.text", messageText.validation.addressInvalid);
        });

        it("should save multiple JUP- addresses if valid", () => {
          cy.get("button").contains("+").click();
          addAddressToAddressbook(Constants.validAddress);
          cy.get('input[placeholder*="Enter Address"]').clear();
          addAddressToAddressbook(Constants.validAddress2);
          cy.get('input[placeholder*="Enter Address"]').clear();
          addAddressToAddressbook(Constants.validAddress3);
          cy.get(".MuiTableRow-root").should("contain.text", Constants.validAddress);
          cy.get(".MuiTableRow-root").should("contain.text", Constants.validAddress2);
          cy.get(".MuiTableRow-root").should("contain.text", Constants.validAddress3);
        });
      });

      describe("send widget", () => {
        beforeEach(() => {
          cy.visit("/");
          existingUserLogin();
        });

        it("should allow send after entering valid address and quantity", () => {
          cy.get('input[placeholder*="To Address"]').type(Constants.validAddress);
          cy.get("#sendWidget :nth-child(2) > .MuiInput-input").type(Constants.validSmallSendQuantity);
          cy.get("#sendWidget .MuiButton-root").contains("Send").click();

          cy.get(".Mui-error > .MuiInput-input").should("not.exist"); // shouldn't be an error

          // test for display of seed collection window
          cy.contains(Constants.isSeedPhraseCollectionOpen).should("exist");

          // check for snackbar during cancel
          cy.get("button").contains("Done").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.transaction.cancel); // snackbar

          // check for snackbar during failure (no seed entered)
          cy.get("#sendWidget .MuiButton-root").contains("Send").click();
          cy.contains("Confirm").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.transaction.failure); // snackbar

          // check for snackbar on successful send
          cy.get("#sendWidget .MuiButton-root").contains("Send").click();
          cy.get('input[placeholder*="Enter Seed Phrase"]').type(testnetSeedPhrase);
          cy.contains("Confirm").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.transaction.success); // snackbar
        });

        it("should not allow send after entering an invalid address and valid quantity", () => {
          cy.get('input[placeholder*="To Address"]').type(Constants.invalidToAddress);
          cy.get("#sendWidget :nth-child(2) > .MuiInput-input").type(Constants.validSmallSendQuantity);
          cy.get("button").contains("Send").click();

          cy.get(".Mui-error > .MuiInput-input").should("exist"); // input should be in error state
          cy.get('input[placeholder*="Enter Seed Phrase"]').should("not.exist"); // seed collection should not.exist
          cy.get("#notistack-snackbar").should("contain.text", "Invalid address"); // snackbar
        });
      });

      describe("dex widget", () => {
        beforeEach(() => {
          cy.visit("/");
          existingUserLogin();
        });

        it("should allow search by asset Name", () => {
          cy.get("div").find(">label").parent().type(Constants.validDexWidgetSearchByName);
          cy.contains(Constants.validSearchByNameResult).should("exist");
        });

        it("should produce no results for an invalid search by asset name", () => {
          cy.get("div").find(">label").parent().type(Constants.invalidDexWidgetSearchByName);
          cy.get("li").should("not.exist");
        });

        it("should allow search by asset ID", () => {
          cy.get("div").find(">label").parent().type(Constants.validDexWidgetSearchByAssetId);
          cy.contains(Constants.validSearchByAssetIdResult).should("exist");
        });

        it("should produce no results for an invalid search by asset Id", () => {
          cy.get("div").find(">label").parent().type(Constants.invalidDexWidgetSearchByAssetId);
          cy.get("li").should("not.exist");
        });

        it("should provide bid/ask order info", () => {
          cy.get("div").find(">label").parent().type(Constants.validDexWidgetSearchByAssetId);
          cy.contains(Constants.validSearchByAssetIdResult).click();
          cy.contains(Constants.highestBidOrderPrice).should("exist");
          cy.contains(Constants.lowestAskOrderPrice).should("exist");
        });

        it("should not open collection dialog when inputs aren't filled out", () => {
          cy.get("div").find(">label").parent().type(Constants.validDexWidgetSearchByAssetId);
          cy.contains(Constants.validSearchByAssetIdResult).click();
          cy.get("button").contains("Buy").click();
          cy.get("button").contains("Sell").click();
          cy.contains(Constants.isSeedPhraseCollectionOpen).should("not.exist");
        });

        it("on buy, should open collection dialog when inputs are properly filled out", () => {
          cy.get("div").find(">label").parent().type(Constants.validDexWidgetSearchByAssetId);
          cy.contains(Constants.validSearchByAssetIdResult).click();
          cy.get('input[placeholder*="Price"]').type("1");
          cy.get('input[placeholder*="Quantity"]').eq(0).type("1");

          cy.get("button").contains("Buy").click();
          cy.contains(Constants.isSeedPhraseCollectionOpen).should("exist");
        });

        it("on sell, should open collection dialog when inputs are properly filled out", () => {
          cy.get("div").find(">label").parent().type(Constants.validDexWidgetSearchByAssetId);
          cy.contains(Constants.validSearchByAssetIdResult).click();
          cy.get('input[placeholder*="Price"]').type("1");
          cy.get('input[placeholder*="Quantity"]').eq(0).type("1");

          cy.get("button").contains("Sell").click();
          cy.contains(Constants.isSeedPhraseCollectionOpen).should("exist");
        });

        // order message is not correct, currently it's messageText.transaction.success which must be a defect in the useAPIRouter()
        it("should execute a buy properly", () => {
          cy.get("div").find(">label").parent().type(Constants.validDexWidgetSearchByAssetId);
          cy.contains(Constants.validSearchByAssetIdResult).click();
          cy.get('input[placeholder*="Price"]').type("1");
          cy.get('input[placeholder*="Quantity"]').eq(0).type("1");

          cy.get("button").contains("Buy").click();
          cy.get('input[placeholder*="Enter Seed Phrase"]').type(testnetSeedPhrase);
          cy.get("button").contains("Confirm & Send").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.orders.success); // snackbar
        });

        // BUG: order message is not correct, currently it's messageText.transaction.success which must be a defect in the useAPIRouter()
        it("should execute a sell properly", () => {
          cy.get("div").find(">label").parent().type(Constants.validDexWidgetSearchByAssetId);
          cy.contains(Constants.validSearchByAssetIdResult).click();
          cy.get('input[placeholder*="Price"]').type("1");
          cy.get('input[placeholder*="Quantity"]').eq(0).type("1");

          cy.get("button").contains("Sell").click();
          cy.get('input[placeholder*="Enter Seed Phrase"]').type(testnetSeedPhrase);
          cy.get("button").contains("Confirm & Send").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.orders.success); // snackbar
        });

        it("should fire cancellation snackbar message", () => {
          cy.get("div").find(">label").parent().type(Constants.validDexWidgetSearchByAssetId);
          cy.contains(Constants.validSearchByAssetIdResult).click();
          cy.get('input[placeholder*="Price"]').type("1");
          cy.get('input[placeholder*="Quantity"]').eq(0).type("1");

          cy.get("button").contains("Sell").click();
          cy.get("button").contains("Done").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.transaction.cancel); // snackbar
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
          cy.get('input[value*="Set Name"]').type("{selectall}").type(Constants.accountNameTestText);
          cy.get("button").contains("Update Account Info").click();
          cy.get('input[placeholder*="Enter Seed Phrase"]').type(testnetSeedPhrase);
          cy.get("button").contains("Confirm & Send").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.userInfo.success); // snackbar
        });
      });

      describe("settings menu", () => {
        beforeEach(() => {
          cy.visit("/");
          existingUserLogin();
        });

        it("should logout properly", () => {
          cy.get(".MuiPaper-root > .MuiToolbar-root > button").last().click();
          cy.contains(Constants.logoutText).should("exist");
          cy.contains(Constants.logoutText).click();
          cy.get("button").contains("Existing User").should("exist");
        });

        it("should open about dialog", () => {
          cy.get(".MuiPaper-root > .MuiToolbar-root > button").last().click();
          cy.contains(Constants.aboutText).should("exist");
          cy.contains(Constants.aboutText).click();
        });
      });

      describe("blocks widget", () => {
        beforeEach(() => {
          cy.visit("/");
          existingUserLogin();
        });

        // note: this test fails when the block updates during test because cypress can be fairly slow to select the next element
        it("should display the same block height as the block height chip", () => {
          cy.get(".MuiToolbar-root > .MuiChip-root > .MuiChip-label").invoke("text").should("match", /\d+/g).as("blockHeight");

          cy.get(".MuiTableBody-root > :nth-child(1) > :nth-child(1) > .MuiTypography-root").then(($blockHeightElement) => {
            const currentHeight = $blockHeightElement.text();
            cy.get("@blockHeight").should("contain", currentHeight);
          });
        });

        it("should display the block detail dialog when clicked", () => {
          // Start from the chip in the toolbar to obtain the block height number
          cy.get(".MuiToolbar-root > .MuiChip-root > .MuiChip-label")
            .invoke("text")
            .should("match", /\d+/g)
            .then(($chipText) => {
              cy.get(".MuiTableBody-root > :nth-child(1) > :nth-child(1) > .MuiTypography-root").click();
              // This doesn't seem ideal but I can't get regex group matching to store just the height numbers instead of "Height: <number>"
              cy.contains(`Detailed overview for block: ${$chipText.split(" ")[1]}`).should("exist");
            });
        });

        it("should show notistack of failed call to api for getBlock", () => {
          cy.intercept("http://localhost:3080/nxt?requestType=getBlock", { forceNetworkError: true });
          cy.get(".MuiTableBody-root > :nth-child(1) > :nth-child(1) > .MuiTypography-root").click();

          // check snackbar text appears properly for this error
          cy.get("#notistack-snackbar").should(($snackbar) => {
            expect($snackbar).to.contain(messageText.errors.api.replace("{api}", ""));
            expect($snackbar).to.contain("getBlock");
          });
        });

        it("should change pages", () => {
          cy.get('#recent_blocks [aria-label="Go to next page"] > [data-testid="KeyboardArrowRightIcon"]').click();

          //NOTE: unicode 2013 is a special hyphen
          const hyphen = "\u2013";
          cy.get("#recent_blocks p.MuiTablePagination-displayedRows").invoke("text").should("contain", `4${hyphen}6 of `);
        });

        it("recent blocks should change rows per page", () => {
          cy.get("#mui-13").click();
          cy.get('.MuiList-root > [tabindex="-1"]').click();
          cy.get("#mui-13").should("contain", "5");
        });
      });

      describe("portfolio widget", () => {
        beforeEach(() => {
          cy.visit("/");
          existingUserLogin();
        });

        it("portfolio copy button should copy properly", () => {
          cy.contains(Constants.copyButtonText).click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.copy.success); // snackbar

          cy.window().its("navigator.clipboard").invoke("readText").should("equal", "6471156456525729821");
        });

        it("my portfolio should change rows per page", () => {
          cy.get("#mui-6").click();
          cy.get('.MuiList-root > [tabindex="-1"]').click();
          cy.get("#mui-6").should("contain", "5");
        });

        it("should send asset properly", () => {
          // get send button, click, enter input details on popup dialog
          cy.get(":nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiTableContainer-root")
            .children()
            .contains(Constants.sendAssetButtonText)
            .click();
          cy.get(".css-1y48f0p-MuiStack-root > :nth-child(1) > .MuiInput-input").type(Constants.validAddress);
          cy.get(".css-1y48f0p-MuiStack-root > :nth-child(2) > .MuiInput-input").type(Constants.validSmallSendQuantity);

          // proceed to next dialog step
          cy.get("button").contains("Next").click();

          // test cancelling the send with the done button
          cy.get(".MuiDialogActions-root > .MuiButton-root").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.transaction.cancel); // snackbar

          // re-type the details
          cy.get(":nth-child(1) > :nth-child(1) > .MuiPaper-root > .MuiTableContainer-root")
            .children()
            .contains(Constants.sendAssetButtonText)
            .click();
          cy.get(".css-1y48f0p-MuiStack-root > :nth-child(1) > .MuiInput-input").type(Constants.validAddress);
          cy.get(".css-1y48f0p-MuiStack-root > :nth-child(2) > .MuiInput-input").type(Constants.validSmallSendQuantity);

          // perform the send properly
          cy.get("button").contains("Next").click();
          cy.get('input[placeholder*="Enter Seed Phrase"]').type(testnetSeedPhrase);
          cy.get("button").contains("Confirm & Send").click();
          cy.get("#notistack-snackbar").should("contain.text", messageText.transaction.success); // snackbar

          // these don't work yet but would be a nicer selector
          // cy.get('input[placeholder*="Enter "To" Address"]').type("JUP-TEST");
          // cy.get('input[placeholder*="Enter Address"]').type("1");
        });
      });

      describe("transactions widget", () => {
        beforeEach(() => {
          cy.visit("/");
          existingUserLogin();
        });

        it("my transactions should change rows per page", () => {
          cy.get("#mui-10").click();
          cy.get('.MuiList-root > [tabindex="-1"]').click();
          cy.get("#mui-10").should("contain", "5");
        });
      });

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

        it("Twitter navigation should work", () => {
          cy.contains("Twitter").invoke("attr", "href").should("equal", "https://twitter.com/JUP_Project");
          cy.contains("Twitter").invoke("attr", "target").should("equal", "_blank");
        });

        it("Blog navigation should work", () => {
          cy.contains("Blog").invoke("attr", "href").should("equal", "https://blog.gojupiter.tech/");
          cy.contains("Blog").invoke("attr", "target").should("equal", "_blank");
        });

        it("Main site navigation should work", () => {
          cy.contains("Main Website").invoke("attr", "href").should("equal", "https://jup.io/");
          cy.contains("Main Website").invoke("attr", "target").should("equal", "_blank");
        });

        it("Metis navigation should work", () => {
          cy.contains("Metis").invoke("attr", "href").should("equal", "https://jup.io/metis-messenger");
          cy.contains("Metis").invoke("attr", "target").should("equal", "_blank");
        });

        it("Leda navigation should work", () => {
          cy.contains("Leda").invoke("attr", "href").should("equal", "https://leda.jup.io/");
          cy.contains("Leda").invoke("attr", "target").should("equal", "_blank");
        });

        it("Portfolio full page navigation should work", () => {
          cy.contains("My Portfolio").click();
          cy.url().should("contain", "/portfolio");
        });

        it("Transactions full page navigation should work", () => {
          cy.contains("My Transactions").click();
          cy.url().should("contain", "/transactions");
        });

        it("Blocks full page navigation should work", () => {
          cy.contains("Recent Blocks").click();
          cy.url().should("contain", "/blocks");
        });
      });
    },
    xs: () => {},
    sm: () => {},
    md: () => {},
    lg: () => {},
  },
} as ITestSuite;
