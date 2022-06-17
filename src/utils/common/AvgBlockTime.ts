//
// Calculates the average blocktime across a span of block objects
//

import { IBlock } from "types/NXTAPI";

export function CalculateAvgBlocktime(blocks: Array<IBlock>) {
  let finalAverage = 0;

  try {
    let prevBlock = blocks[0];
    const blockCount = blocks.length;
    let totalTime = 0;

    for (const block of blocks) {
      const blockTime = prevBlock.timestamp - block.timestamp;
      totalTime += blockTime;
      prevBlock = block;
    }

    finalAverage = totalTime / blockCount;
  } catch (e) {
    console.error("Error during avg blocktime calculation", e);
    return;
  }

  return finalAverage;
}
