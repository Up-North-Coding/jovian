import {
  IGetAccountIdResult,
  IGetAccountResult,
  IGetBlockchainStatusResult,
  IGetBalanceResult,
  IUnsignedTransaction,
  IGetBlockchainTransactionResult,
  IGetBlocksResult,
} from "types/NXTAPI";

export interface ContextValues {
  getBlockchainStatus?: () => Promise<false | IGetBlockchainStatusResult>;
  getAccount?: (account: string) => Promise<false | IGetAccountResult>;
  setAccountInfo?: (secret: string, accountName: string, accountDescr: string) => Promise<any>;
  getAccountId?: (publicKey: string) => Promise<false | IGetAccountIdResult>;
  getBalance?: (account: string) => Promise<false | IGetBalanceResult>;
  getMyTxs?: (account: string) => Promise<false | IGetBlockchainTransactionResult>;
  getBlocks?: (firstIndex: number, lastIndex: number) => Promise<false | IGetBlocksResult>;

  handleFetchAccountIDFromRS?: (address: string) => Promise<string | undefined>;
}
