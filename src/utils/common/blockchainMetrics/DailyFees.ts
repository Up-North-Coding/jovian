//
// Calculates the daily transaction fees across a span of block objects
//

import { BigNumber } from "bignumber.js";
import { IBlock, ITransaction } from "types/NXTAPI";
import { OneDayOfBlocks } from "../constants";
import { NQTtoNXT } from "../NQTtoNXT";

export function CalculateDailyFees(blocks: Array<IBlock>) {
  let fees = new BigNumber(0);
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

  // total up all of the fees
  for (const tx of transactions) {
    fees = fees.plus(NQTtoNXT(new BigNumber(tx.feeNQT)));
  }

  return fees;
}
