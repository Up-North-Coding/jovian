//
// API call helper for placeBidOrder & placeAskOrder, not meant to be called directly (meant to be used inside the APIProvider)
//

import { standardDeadline, standardFee } from "utils/common/constants";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

// http://localhost:7876/nxt?
//   requestType=placeBidOrder&
//   secretPhrase=IWontTellYou&
//   asset=17554243582654188572&
//   quantityQNT=1000000&
//   priceNQT=100&
//   feeNQT=100000000&
//   deadline=60

// http://localhost:7876/nxt?
//   requestType=placeAskOrder&
//   secretPhrase=IWontTellYou&
//   asset=17554243582654188572&
//   quantityQNT=1000000&
//   priceNQT=100&
//   feeNQT=100000000&
//   deadline=60

interface IPlaceOrderPayload extends IAPICall {
  data: {
    asset: number;
    publicKey: string;
    senderRS: string;
    quantityQNT: string;
    priceNQT: string;
    secretPhrase: string;
    feeNQT: string;
    deadline: number;
  };
}

export async function placeOrder({ ...args }) {
  let result;
  let requestType = "";

  if (args.orderType === "bid") {
    requestType = "placeBidOrder";
  } else if (args.orderType === "ask") {
    requestType = "placeAskOrder";
  }

  const options: IPlaceOrderPayload = {
    url: BASEURL,
    method: "POST",
    requestType: requestType,
    data: {
      // args
      asset: args.asset,
      publicKey: args.publicKey,
      senderRS: args.senderRS,
      quantityQNT: args.quantityQNT,
      priceNQT: args.priceNQT,
      secretPhrase: args.secretPhrase,

      // standards
      feeNQT: standardFee,
      deadline: standardDeadline,
    },
  };

  try {
    result = await API(options);
  } catch (e) {
    console.error("error placeOrder():", e);
    return false;
  }
  return result;
}
