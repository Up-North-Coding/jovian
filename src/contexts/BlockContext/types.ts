import { IBlock } from "types/NXTAPI";

export interface ContextValues {
  blockHeight?: number;
  recentBlocks?: Array<IBlock>;
  getBlockDetails?: (height: number) => Promise<IBlock | false>;
  avgBlockTime?: string;
  dailyTxs?: string;
  dailyFees?: string;
  avgTxValue?: string;
}
