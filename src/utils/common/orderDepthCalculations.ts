//
// Orderbook related helper functions for depth calculations
//

import { BigNumber } from "bignumber.js";
import { IOpenOrder } from "types/NXTAPI";

// when provided with an order book and a proposed size, this function will work its way through the book
// to determine if there's enough depth to support the order and calculate other pieces of info along the way
export async function isAdequateDepth(orderSize: BigNumber, orderBook: Array<IOpenOrder>): Promise<boolean> {
  let remainingToFill = orderSize;
  let orderDepthIndex = 0;
  let isSufficientDepth;
  console.log("starting order size:", orderSize.toFixed(8));

  // using an every here because the iteration needs to break out early if we have sufficient depth
  orderBook.every((order: IOpenOrder, index: number) => {
    orderDepthIndex = index;

    // if the next order will support the remaining order sized, we're done
    if (remainingToFill.minus(order.quantityQNT).toNumber() < 0) {
      console.log(`left to fill: ${remainingToFill} next order on books: ${order.quantityQNT} iteration: ${index}`);
      isSufficientDepth = true;
      return false;
    }

    // if there is still remaining order volume to fill we need to continue iteration
    remainingToFill = remainingToFill.minus(order.quantityQNT);
    console.log(`continuing loop, remaining: ${remainingToFill}, quantity: ${order.quantityQNT} iteration: ${index}`);
    isSufficientDepth = false;
    return true;
  });

  console.log(`depth check completed, index: ${orderDepthIndex} sufficient depth?: ${isSufficientDepth}`);

  //  now we want to calculate the avg price the customer would get based on the order size submitted
  //   for (let depth = 0; depth <= orderDepthIndex; depth++) {
  //     console.log(`processing orders to depth: ${orderDepthIndex} with price: ${orderBook[depth].priceNQT} and qty: ${orderBook[depth].quantityQNT}`);
  //   }

  return isSufficientDepth || false; // return false for default for now
}
