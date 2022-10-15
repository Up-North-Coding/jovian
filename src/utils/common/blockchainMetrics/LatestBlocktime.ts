//
// Returns the most recent blocktime across a span of block objects
//

import { IBlock } from "types/NXTAPI";
import { TimestampToDate } from "../Formatters";

export function FetchLatestBlocktime(blocks: Array<IBlock>): string {
  return TimestampToDate(blocks[0].timestamp);
}
