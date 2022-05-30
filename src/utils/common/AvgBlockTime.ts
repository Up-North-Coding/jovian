//
// Calculates the average blocktime across a span of block objects
//

import { IBlock } from "types/NXTAPI";

export function CalculateAvgBlocktime(blocks: Array<IBlock>) {
  let prevBlock = blocks[0];
  const blockCount = blocks.length;
  let totalTime = 0;
  let finalAverage = 0;

  for (const block of blocks) {
    const blockTime = prevBlock.timestamp - block.timestamp;
    totalTime += blockTime;
    prevBlock = block;
  }

  finalAverage = totalTime / blockCount;
  // console.log(`current total of block times: ${totalTime} average: ${finalAverage} based on ${blockCount} blocks`);
  return finalAverage;
}
