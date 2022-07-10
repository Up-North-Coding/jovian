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
} from "types/NXTAPI";

export interface ContextValues {
  getBlockchainStatus?: () => Promise<false | IGetBlockchainStatusResult>;
  getAccount?: (account: string) => Promise<false | IGetAccountResult>;
  setAccountInfo?: (secret: string, accountName: string, accountDescr: string) => Promise<any>;
  getAccountId?: (publicKey: string) => Promise<false | IGetAccountIdResult>;
  getBalance?: (account: string) => Promise<false | IGetBalanceResult>;
  getMyTxs?: (account: string) => Promise<false | IGetBlockchainTransactionResult>;
  getBlocks?: (firstIndex: number, lastIndex: number) => Promise<false | IGetBlocksResult>;
  getAccountAssets?: (account: string) => Promise<false | IGetAccountAssetsResult>;
  getAsset?: (assetId: string) => Promise<false | IGetAssetResult>;
  getOrders?: (assetId: string) => Promise<false | IGetOrdersResult>;
  searchAssets?: (queryString: string) => Promise<false | ISearchAssetsResult>;
  handleFetchAccountIDFromRS?: (address: string) => Promise<string | undefined>;
}
