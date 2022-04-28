import { IGetAccountIdResult, IGetAccountResult, IGetBlockchainStatusResult, IUnsignedTransaction } from "types/NXTAPI";

export interface ContextValues {
  getBlockchainStatus?: () => Promise<false | IGetBlockchainStatusResult>;
  getAccount?: (account: string) => Promise<false | IGetAccountResult>;
  getAccountId?: (publicKey: string) => Promise<false | IGetAccountIdResult>;
  sendJUP?: (unsignedTxJSON: IUnsignedTransaction) => Promise<boolean>;
}
