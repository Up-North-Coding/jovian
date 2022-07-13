export interface ContextValues {
  sendJUP?: (toAddress: string, amount: string) => Promise<true | undefined>;
  sendAsset?: (toAddress: string, amount: string, assetId: string) => Promise<true | undefined>;
  placeBidOrder?: (assetID: number, quantityQNT: string, priceNQT: string, secret: string) => Promise<true | undefined>;
}
