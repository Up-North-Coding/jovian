//
// Basic converter to handle the NQT (JQT?) balances returned from the API
//
// Docs: https://nxtdocs.jelurida.com/API#Quantity_Units_NXT.2C_NQT_and_QNT
//

import { BigNumber } from "bignumber.js";
import { addCommaSeparators } from "./addCommaSeparators";
import { PrecisionExponent } from "./constants";

export function NQTtoNXT(quantity: BigNumber, precision: number): string {
  return addCommaSeparators(new BigNumber(quantity).dividedBy(10 ** PrecisionExponent).toFixed(precision));
}
