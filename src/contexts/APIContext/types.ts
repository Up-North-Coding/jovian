import { IGetAccountIdResult, IGetAccountResult, IGetBalanceResult, IUnsignedTransaction } from "types/NXTAPI";

export interface ContextValues {
  getAccount?: (account: string) => Promise<false | IGetAccountResult>;
  getAccountId?: (publicKey: string) => Promise<false | IGetAccountIdResult>;
  getBalance?: (account: string) => Promise<false | IGetBalanceResult>;
  sendJUP?: (unsignedTxJSON: IUnsignedTransaction) => Promise<boolean>;
}
