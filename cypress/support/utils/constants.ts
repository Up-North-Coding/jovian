//
// Testing specific constants which drive the entire test suite
//

// login page
export const loginAddress = "JUP-WQFQ-W64L-HT3P-C9YNM"; // account used to login with
export const unusedLoginAddress = "JUP-TEST-TEST-TEST-TESTT"; // unused account with no public key
export const secretPhraseLoginString = "horse pool window plant mouse paper row plate dog spoon plastic grape"; // do not use this seed, it's for testing only
export const shortSecretPhrase = "one two three four five six seven eight nine ten eleven"; // do not use this seed, it's for testing only and is one word short of a normal 12 word seed

// general
export const validAddress = loginAddress; // a valid address to send to and perform other tests with
export const validAddress2 = "JUP-XTAE-VA6X-4SRT-AU89L"; // another valid address when multiple addresses are needed for a single test
export const validAddress3 = "JUP-WG5A-4T78-HY7V-5Q7LN"; // another valid address when multiple addresses are needed for a single test
export const validAddress4 = "JUP-KDZ9-6R5W-WFPV-BT9F7"; // another valid address when multiple addresses are needed for a single test
export const invalidToAddress = "JUP-22KR-XAA6-PV4K-4U8E"; // an invalid adddress, missing its final character
export const validSmallSendQuantity = "1"; // a small quantity for testing sends and other validation
export const accountNameTestText = `Cypress Testing: ${Math.random()}`; // a psuedo unique account name to test userInfo updates
export const isSeedPhraseCollectionOpen = "Please Enter Your Seed Phrase"; // indicates seed phrase collection window is opened

// dex widget testing parameters for testnet
export const validDexWidgetSearchByName = "FORGE"; // valid asset name to search for
export const validSearchByNameResult = "FORGE - 15210174725739850610"; // result from performing valud search by name
export const invalidDexWidgetSearchByName = "BLEMFLARCK799"; // invalid asset name to search for
export const validDexWidgetSearchByAssetId = "6471156456525729821"; // valid assetId to search for
export const validSearchByAssetIdResult = "ASTRO - 6471156456525729821"; // valid assetId to search for
export const invalidDexWidgetSearchByAssetId = "1234567891234567891"; // invalid assetId to search for
export const highestBidOrderPrice = "Highest Bid: 1.00000000";
export const lowestAskOrderPrice = "Lowest Ask: 2.00000000";

// portfolio testing parameters for testnet
export const copyButtonText = "Copy Asset ID"; // text to find the copy asset ID button
export const sendAssetButtonText = /^Send$/i; // text to find the send button in the portfolio widget

// settings menu
export const logoutText = "Logout";
export const aboutText = "About";
