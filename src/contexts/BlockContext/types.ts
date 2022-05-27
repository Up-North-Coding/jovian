import { IBlock } from "types/NXTAPI";

export interface ContextValues {
  blockHeight?: number;
  recentBlocks?: Array<IBlock>;
}
