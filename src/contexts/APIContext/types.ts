import {
  IGetAccountIdResult,
  IGetAccountResult,
  IGetBalanceResult,
  IGetBlockchainTransactionResult,
  IGetAssetResult,
  ISearchAssetsResult,
  IGetOrdersResult,
  IGetPeersResult,
  IGetPeerResult,
  IPeerInfo,
  IGetTradesResult,
  IGenerator,
  IGetNextBlockGeneratorsResult,
  IGetBlockResult,
} from "types/NXTAPI";

export interface ContextValues {
  getAccount?: (account: string) => Promise<undefined | IGetAccountResult>;
  getAccountId?: (publicKey: string) => Promise<undefined | IGetAccountIdResult>;
  getBalance?: (account: string) => Promise<undefined | IGetBalanceResult>;
  getMyTxs?: (account: string) => Promise<undefined | IGetBlockchainTransactionResult>;
  getBlock?: (height: number, includeTransactions: boolean) => Promise<undefined | IGetBlockResult>;
  getAsset?: (assetId: string) => Promise<undefined | IGetAssetResult>;
  getOrders?: (assetId: string) => Promise<undefined | IGetOrdersResult>;
  getPeer?: (peer: string) => Promise<undefined | IGetPeerResult>;
  getPeers?: () => Promise<undefined | IGetPeersResult>;
  searchAssets?: (queryString: string) => Promise<undefined | ISearchAssetsResult>;
  getTrades?: (assetId: string, account?: string) => Promise<undefined | IGetTradesResult>;
  handleFetchAccountIDFromRS?: (address: string) => Promise<string | undefined>;
  getGenerators?: () => Promise<undefined | IGetNextBlockGeneratorsResult>;

  // returned objects
  peers?: Array<string>;
  peerDetails?: Array<IPeerInfo>;
  generators?: Array<IGenerator>;
}
