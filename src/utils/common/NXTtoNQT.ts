//
// Basic converter to handle the NQT (JQT?) balances returned from the API
//
// Docs: https://nxtdocs.jelurida.com/API#Quantity_Units_NXT.2C_NQT_and_QNT
//

import { BigNumber } from "bignumber.js";
import { PrecisionExponent } from "./constants";

export function NXTtoNQT(quantity: BigNumber): BigNumber {
  return new BigNumber(quantity.multipliedBy(10 ** PrecisionExponent));
}
