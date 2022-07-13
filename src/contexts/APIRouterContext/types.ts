export interface ContextValues {
  sendJUP?: (toAddress: string, amount: string) => Promise<true | undefined>;
  sendAsset?: (toAddress: string, amount: string, assetId: string) => Promise<true | undefined>;
  placeOrder?: (orderType: "bid" | "ask", assetID: number, quantityQNT: string, priceNQT: string) => Promise<true | undefined>;
}
