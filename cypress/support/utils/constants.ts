//
// Testing specific constants which drive the entire test suite
//

export const loginAddress = "JUP-WQFQ-W64L-HT3P-C9YNM"; // account used to login with

export const validToAddress = loginAddress; // a valid address to send to and perform other tests with
export const invalidToAddress = "JUP-22KR-XAA6-PV4K-4U8E"; // an invalid adddress, missing its final character
export const validSmallSendQuantity = "1"; // a small quantity for testing sends and other validation
export const accountNameTestText = `Cypress Testing: ${Math.random()}`; // a psuedo unique account name to test userInfo updates
