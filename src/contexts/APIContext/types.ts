export interface ContextValues {
  getAccount?: (account: string) => Promise<string>;
}
