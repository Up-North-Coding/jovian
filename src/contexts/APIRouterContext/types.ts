import { BigNumber } from "bignumber.js";

export interface ContextValues {
  sendJUP?: (toAddress: string, amount: string) => Promise<true | undefined>;
  sendAsset?: (toAddress: string, amount: string, assetId: string) => Promise<true | undefined>;
  placeOrder?: (orderType: "bid" | "ask", assetID: string, quantityQNT: BigNumber, priceNQT: BigNumber) => Promise<true | undefined>;
}
