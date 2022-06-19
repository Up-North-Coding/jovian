export interface ContextValues {
  sendJUP?: (toAddress: string, amount: string) => Promise<true | undefined>;
}
