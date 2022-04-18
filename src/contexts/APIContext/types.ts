import { IAccount } from "types/NXTAPI";

export interface ContextValues {
  getAccount?: (account: string) => Promise<string>;
}
