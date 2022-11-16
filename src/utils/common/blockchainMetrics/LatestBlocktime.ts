//
// Returns the most recent blocktime across a span of block objects
//

import { IBlock } from "types/NXTAPI";
import { TimestampToDate } from "../Formatters";

export function FetchLatestBlocktime(blocks: Array<IBlock>): string {
  if (blocks.length === 0) {
    throw new Error("Blocks array must contain at least one block for FetchLatestBlocktime to work.");
  }

  return TimestampToDate(blocks[0].timestamp);
}
