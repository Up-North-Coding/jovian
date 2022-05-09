import {
  IGetAccountIdResult,
  IGetAccountResult,
  IGetBlockchainStatusResult,
  IGetBalanceResult,
  IUnsignedTransaction,
  IGetBlockchainTransactionResult,
} from "types/NXTAPI";

export interface ContextValues {
  getBlockchainStatus?: () => Promise<false | IGetBlockchainStatusResult>;
  getAccount?: (account: string) => Promise<false | IGetAccountResult>;
  setAccountInfo?: (secret: string, accountName: string, accountDescr: string) => Promise<any>;
  getAccountId?: (publicKey: string) => Promise<false | IGetAccountIdResult>;
  getBalance?: (account: string) => Promise<false | IGetBalanceResult>;
  sendJUP?: (unsignedTxJSON: IUnsignedTransaction) => Promise<boolean>;
  getMyTxs?: (account: string) => Promise<false | IGetBlockchainTransactionResult>;
}
