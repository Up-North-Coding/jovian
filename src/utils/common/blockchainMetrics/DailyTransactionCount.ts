//
// Counts transactions across ~24 hours of blocks
//

import { IBlock } from "types/NXTAPI";
import { OneDayOfBlocks } from "../constants";

export function TxCount(blocks: Array<IBlock>) {
  let count = 0;
  let currentBlock = 0;
  const blocksToProcess = OneDayOfBlocks;

  for (const block of blocks) {
    count += block.numberOfTransactions;
    currentBlock++;

    // stop processing after hitting ~1 day of blocks
    if (currentBlock >= blocksToProcess) {
      break;
    }
  }

  return count;
}
