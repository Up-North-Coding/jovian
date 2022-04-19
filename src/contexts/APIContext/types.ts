export interface ContextValues {
  getAccount?: (account: string) => Promise<any>;
  sendJUP?: (unsignedTxJSON: any) => Promise<any>;
}
