import { IGetAccountIdResult, IGetAccountResult, IUnsignedTransaction } from "types/NXTAPI";

export interface ContextValues {
  getAccount?: (account: string) => Promise<false | IGetAccountResult>;
  getAccountId?: (publicKey: string) => Promise<false | IGetAccountIdResult>;
  sendJUP?: (unsignedTxJSON: IUnsignedTransaction) => Promise<boolean>;
}
