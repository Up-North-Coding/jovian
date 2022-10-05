//
// Takes in quantity and price strings and converts them to big numbers before returning the product of them
//

import { BigNumber } from "bignumber.js";
import { IBlock } from "types/NXTAPI";
import { LongUnitPrecision } from "./constants";

export function QtyPriceToTotal(quantity: string, price: string): string | false {
  let total;

  try {
    total = new BigNumber(quantity).times(new BigNumber(price)).toFixed(LongUnitPrecision);
  } catch (e) {
    console.error("Error during total calculation", e);
    return false;
  }

  return total;
}
