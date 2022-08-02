//
// Testing specific constants which drive the entire test suite
//

export const loginAddress = "JUP-WQFQ-W64L-HT3P-C9YNM"; // account used to login with

export const validToAddress = loginAddress; // a valid address to send to and perform other tests with
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