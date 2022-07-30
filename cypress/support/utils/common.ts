import { loginAddress } from "./constants";

export const expectClickExistingUserButton = () => {
  cy.get("button").contains("Existing User").click();
};

// a helper for performing the entire existing user workflow (to get to other views more easily, initiate a login during test, etc...)
export const existingUserLogin = () => {
  expectClickExistingUserButton();
  cy.get(".MuiAutocomplete-input").type(loginAddress);
  cy.get("label").contains("Remember Account?").click();
  cy.get("button").contains("Login").click();
};
