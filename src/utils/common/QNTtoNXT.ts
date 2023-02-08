//
// Basic converter to handle the QNT balances returned from the API, for assets
//
// Docs: https://nxtdocs.jelurida.com/API#Quantity_Units_NXT.2C_NQT_and_QNT
//

import { BigNumber } from "bignumber.js";
import { addCommaSeparators } from "./addCommaSeparators";

export function QNTtoNXT(quantity: BigNumber, decimals: number, precision: number): string {
  return addCommaSeparators(new BigNumber(quantity).dividedBy(10 ** decimals).toFixed(precision));
}
