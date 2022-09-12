import {
  IGetAccountIdResult,
  IGetAccountResult,
  IGetBlockchainStatusResult,
  IGetBalanceResult,
  IGetBlockchainTransactionResult,
  IGetBlocksResult,
  IGetAccountAssetsResult,
  IGetAssetResult,
  ISearchAssetsResult,
  IGetOrdersResult,
  IBlock,
  IGetTradesResult,
} from "types/NXTAPI";

export interface ContextValues {
  getBlockchainStatus?: () => Promise<false | IGetBlockchainStatusResult>;
  getAccount?: (account: string) => Promise<false | IGetAccountResult>;
  getAccountId?: (publicKey: string) => Promise<false | IGetAccountIdResult>;
  getBalance?: (account: string) => Promise<false | IGetBalanceResult>;
  getMyTxs?: (account: string) => Promise<false | IGetBlockchainTransactionResult>;
  getBlocks?: (firstIndex: number, lastIndex: number, includeTransactions: boolean) => Promise<false | IGetBlocksResult>;
  getBlock?: (height: number, includeTransactions: boolean) => Promise<false | IBlock>;
  getAccountAssets?: (account: string) => Promise<false | IGetAccountAssetsResult>;
  getAsset?: (assetId: string) => Promise<false | IGetAssetResult>;
  getOrders?: (assetId: string) => Promise<false | IGetOrdersResult>;
  searchAssets?: (queryString: string) => Promise<false | ISearchAssetsResult>;
  getTrades?: (assetId: string) => Promise<false | IGetTradesResult>;
  handleFetchAccountIDFromRS?: (address: string) => Promise<string | undefined>;
}
