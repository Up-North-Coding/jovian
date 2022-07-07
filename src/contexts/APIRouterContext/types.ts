export interface ContextValues {
  sendJUP?: (toAddress: string, amount: string) => Promise<true | undefined>;
  sendAsset?: (toAddress: string, amount: string, assetId: string) => Promise<true | undefined>;
}
