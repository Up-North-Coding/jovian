import { IBlock, IGetBlockchainStatusResult, IGetBlockResult } from "types/NXTAPI";

export interface ContextValues {
  blockHeight?: number;
  recentBlocks?: Array<IBlock>;
  dailyFees?: string;
  avgTxValue?: string;
  latestBlocktime?: string;
  getBlockDetails?: (height: number) => Promise<IGetBlockResult | undefined>;
  getBlockchainStatus?: () => Promise<IGetBlockchainStatusResult | undefined>;
  avgBlockTime?: string;
  dailyTxs?: string;
}
