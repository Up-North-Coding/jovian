import { BigNumber } from "bignumber.js";

export interface ContextValues {
  sendJUP?: (toAddress: string, amount: string, includeMessage: boolean) => Promise<true | undefined>;
  sendAsset?: (toAddress: string, amount: string, assetId: string) => Promise<true | undefined>;
  placeOrder?: (orderType: "bid" | "ask", assetID: string, quantityQNT: BigNumber, priceNQT: BigNumber) => Promise<true | undefined>;
  cancelOpenOrder?: (orderType: "bid" | "ask", orderId: string) => Promise<true | undefined>;
  setAccountInfo?: (userName: string, description: string) => Promise<true | undefined>;
}
