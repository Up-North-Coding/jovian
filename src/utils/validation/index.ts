//
// useful validation functions
//

// MUST: need to add additional validators for user input

// currently performs basic format checking, should be extended to support the JUP characters actually used in the NXT standards
// TODO: See if breaking the regex into individual hyphenated checks ["JUP", "ABCD", "EFGH"] is easier to read/write
export function isValidAddress(address: string) {
  // TODO: confirm all letters get used, this currently validates for general structure but not any NXT/JUP standardization
  const JUPREGEX = /^JUP-\w{4}-\w{4}-\w{4}-\w{5}$/;

  if (JUPREGEX.test(address)) {
    return true;
  }
  return false;
}

// Initial assetIds started at a length of 19 but have incremented their way up to length 20. Length of 21 will cover a significant span of time
export function isValidAssetID(assetText: string) {
  const ASSETREGEX = /^\d{19,21}$/;

  if (ASSETREGEX.test(assetText)) {
    return true;
  }
  return false;
}

// validation for send quantity inputs
export function isValidQuantity(quantity: string) {
  // ensure only a single decimal
  if (quantity.split(".").length > 2) {
    console.error("quantity entered has multiple decimals");
    return false;
  }

  // ensure value is a string
  if (typeof quantity !== "string") {
    console.error("quantity entered is not a string");
    return false;
  }

  return true;
}
