//
// Counts transactions across ~24 hours of blocks
//

import { IBlock } from "types/NXTAPI";

export function TxCount(blocks: Array<IBlock>) {
  let count = 0;
  let currentBlock = 0;
  const blocksToProcess = 8640;

  for (const block of blocks) {
    count += block.numberOfTransactions;
    currentBlock++;

    // TODO: Could change this to inspect actual block timestamps but it probably won't effect the daily qty much
    // stop processing after hitting ~1 day of blocks
    if (currentBlock >= blocksToProcess) {
      break;
    }
  }

  return count;
}
