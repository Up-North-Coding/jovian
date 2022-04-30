import { IGetAccountIdResult, IGetAccountResult, IGetBlockchainStatusResult, IGetBalanceResult, IUnsignedTransaction } from "types/NXTAPI";

export interface ContextValues {
  getBlockchainStatus?: () => Promise<false | IGetBlockchainStatusResult>;
  getAccount?: (account: string) => Promise<false | IGetAccountResult>;
  getAccountId?: (publicKey: string) => Promise<false | IGetAccountIdResult>;
  getBalance?: (account: string) => Promise<false | IGetBalanceResult>;
  sendJUP?: (unsignedTxJSON: IUnsignedTransaction) => Promise<boolean>;
}
