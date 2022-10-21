//
// Calculates the average transaction value across a span of block objects
//

import { BigNumber } from "bignumber.js";
import { IBlock, ITransaction } from "types/NXTAPI";
import { LongUnitPrecision, OneDayOfBlocks } from "../constants";
import { NQTtoNXT } from "../NQTtoNXT";

export function CalculateAvgTxValue(blocks: Array<IBlock>): BigNumber {
  let totalValue = new BigNumber(0);
  let avgValue = new BigNumber(0);
  const transactions: Array<ITransaction> = [];
  let currentBlock = 0;
  const blocksToProcess = OneDayOfBlocks;

  for (const block of blocks) {
    block.transactions.length > 0 && transactions.push(...block.transactions);
    currentBlock++;

    // stop processing after hitting ~1 day of blocks
    if (currentBlock >= blocksToProcess) {
      break;
    }
  }

  // add up all of the sent value (only base currencies, not assets)
  for (const tx of transactions) {
    totalValue = totalValue.plus(NQTtoNXT(new BigNumber(tx.amountNQT), LongUnitPrecision));
  }

  // calculate the average from all blocks
  avgValue = totalValue.dividedBy(transactions.length);

  return avgValue;
}
