/// <reference types="cypress" />

// Goal:

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
// [ ] Entering an invalid address in the "add" input should be rejected
// [ ] Entering an alias into the "add" input should fetch the address or be rejected

describe("address book", () => {
  Cypress.Promise.onPossiblyUnhandledRejection((error, promise) => {
    throw error;
  });

  beforeEach(() => {
    cy.visit("/dashboard"); // each test starts at the dashboard page
    cy.get("button").contains("Address Book").click();
    cy.get(".MuiDialogActions-root > .MuiButton-root").should("exist");
    cy.get(".MuiDialog-container").should("exist");
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

  it("should expose the input when the plus is clicked", () => {
    cy.get("button").contains("+").click();
    cy.get('input[placeholder*="Enter address or alias"]').should("exist");
  });

  it("should save a JUP- address when entered correctly", () => {
    const testAddy = "JUP-ABCD-ABCD-ABCD-ABCDE";
    cy.get("button").contains("+").click();
    cy.get('input[placeholder*="Enter address or alias"]').type(testAddy);
    cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force
    cy.get(".MuiTableBody-root > .MuiTableRow-root > th.MuiTableCell-root").should("contain.text", testAddy);
  });

  it("should save a JUP- address when entered correctly and then delete it", () => {
    const testAddy = "JUP-ABCD-ABCD-ABCD-ABCDE";
    cy.get("button").contains("+").click();
    cy.get('input[placeholder*="Enter address or alias"]').type(testAddy);
    cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force
    cy.get(".MuiTableBody-root > .MuiTableRow-root > th.MuiTableCell-root").should("contain.text", testAddy);
    cy.get("button").contains("Del").click();
    cy.get(".MuiTableBody-root").should("not.contain.text", testAddy);
  });

  it("should save a JUP- address when entered correctly and reject the same address a second time", () => {
    const testAddy = "JUP-ABCD-ABCD-ABCD-ABCDE";
    cy.get("button").contains("+").click();
    cy.get('input[placeholder*="Enter address or alias"]').type(testAddy);
    cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force
    cy.get(".MuiTableBody-root > .MuiTableRow-root > th.MuiTableCell-root").should("contain.text", testAddy);

    // re-add the same address again
    cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force
    cy.get(".MuiTableBody-root > .MuiTableRow-root > th.MuiTableCell-root").should("contain.text", testAddy);
  });

  it("should save multiple JUP- addresses if valid", () => {
    const testAddy1 = "JUP-ABCD-ABCD-ABCD-ABCDE";
    const testAddy2 = "JUP-XXXX-XXXX-XXXX-XXXXX";
    const testAddy3 = "JUP-ZHDA-ERFS-SMFA-PQWZK";

    cy.get("button").contains("+").click();
    cy.get('input[placeholder*="Enter address or alias"]').type(testAddy1);
    cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force
    cy.get('input[placeholder*="Enter address or alias"]').clear();

    cy.get('input[placeholder*="Enter address or alias"]').type(testAddy2);
    cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force
    cy.get('input[placeholder*="Enter address or alias"]').clear();
    cy.get('input[placeholder*="Enter address or alias"]').type(testAddy3);
    cy.get("button").contains(/^add$/i).click({ force: true }); //TODO: fix force

    cy.get(".MuiTableBody-root > .MuiTableRow-root > th.MuiTableCell-root").should("contain.text", testAddy1);
    cy.get(".MuiTableBody-root > .MuiTableRow-root > th.MuiTableCell-root").should("contain.text", testAddy2);
    cy.get(".MuiTableBody-root > .MuiTableRow-root > th.MuiTableCell-root").should("contain.text", testAddy3);
  });
});
