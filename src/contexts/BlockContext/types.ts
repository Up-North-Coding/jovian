import { IBlock } from "types/NXTAPI";

export interface ContextValues {
  blockHeight?: number;
  recentBlocks?: Array<IBlock>;
  getBlockDetails?: (height: number) => Promise<IBlock | false>;
  avgBlockTime?: number;
  dailyTxs?: number;
}
