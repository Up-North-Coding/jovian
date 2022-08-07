//
// useful validation functions
//

import { PrecisionExponent } from "utils/common/constants";

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

// further validation for sending functions, this is the last line of defense for
// bad values finding their way into the "private" methods which require paying JUP
// such as order placement, sending JUP, sending assets, etc...
export function sendValidation(value: string): boolean {
  console.log("validating quantity used for send:", value);

  // run the original validation function again as a sanity check
  if (!isValidQuantity(value)) {
    return false;
  }

  // cannot be negative
  if (parseInt(value) < 0) {
    console.error("value cannot be negative");
    return false;
  }

  // maximum possible value for JUP should be total supply
  if (parseInt(value) > 1000000000 ** PrecisionExponent) {
    console.error("value cannot exceed maximum supply");
    return false;
  }

  // maximum possible value for assets should be maximum asset supply
  // if (isAsset) {
  //   console.log("validating an asset input value:", value);
  //   console.log("not implemented yet, need to pass in an assetId or asset max supply to verify against");
  //   return false;
  // }
  return true;
}
