//
// simple utility for adding comma separators to numbers and strings
//

import { BigNumber } from "bignumber.js";

export const addCommaSeparators = (inputVal: string | number | undefined): string => {
  if (inputVal === undefined) {
    return "-";
  }

  // if a passed value is a string we want to use the bignumbers library to convert it to a number so it will have the required toLocaleString() method
  if (typeof inputVal === "string") {
    inputVal = new BigNumber(inputVal).toNumber();
  }

  return inputVal ? inputVal.toLocaleString() : "0";
};
