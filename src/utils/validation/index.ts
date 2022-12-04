//
// useful validation functions
//

import { BigNumber } from "bignumber.js";
import { MaximumSupply, PrecisionExponent } from "utils/common/constants";

// currently performs basic format checking, should be extended to support the JUP characters actually used in the NXT standards
// TODO: See if breaking the regex into individual hyphenated checks ["JUP", "ABCD", "EFGH"] is easier to read/write
export function isValidAddress(address: string) {
  // TODO: confirm all letters get used, this currently validates for general structure but not any NXT/JUP standardization
  const JUPREGEX = /^JUP-\w{4}-\w{4}-\w{4}-\w{5}$/i;

  if (JUPREGEX.test(address)) {
    return true;
  }
  return false;
}

// basic format checking for a secret phrase
// we want to return true if there are 12 words and return false if there are not, so we can warn the user their secret may be malformed
// note: any secret length is acceptable by JUP standards, but if they've been generated through normal channels they will be 12 words
export function isValidSecret(secret: string) {
  const acceptableWordCount = 12;
  const secretWordCount = secret.split(" ").length;
  return secretWordCount === acceptableWordCount;
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
export function isValidQuantity(quantity: string | BigNumber) {
  quantity = bnToString(quantity);

  // ensure value is a string
  if (typeof quantity !== "string") {
    console.error("quantity entered is not a string");
    return false;
  }

  // ensure only a single decimal
  if (quantity.split(".").length > 2) {
    console.error("quantity entered has multiple decimals");
    return false;
  }

  return true;
}

const bnToString = (value: BigNumber | string) => {
  let converted = "";
  if (BigNumber.isBigNumber(value)) {
    converted = value.toString();
    console.log(`converted ${value} to ${converted}`);
    return converted;
  }
  console.log("returning original value, it was already a string:", value);
  return value;
};

// further validation for sending functions, this is the last line of defense for
// bad values finding their way into the "private" methods which require paying JUP
// such as order placement, sending JUP, sending assets, etc...
export function sendValidation(value: string): boolean {
  const quantity = bnToString(value);

  console.log("validating quantity used for send:", quantity);

  // run the original validation function again as a sanity check
  if (!isValidQuantity(quantity)) {
    return false;
  }

  // cannot be negative
  if (parseInt(quantity) < 0) {
    console.error("value cannot be negative");
    return false;
  }

  // maximum possible value for JUP should be total supply
  if (parseInt(value) > MaximumSupply ** PrecisionExponent) {
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
