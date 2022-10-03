//
// API call helper for cancelBidOrder & cancelAskOrder, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IOrdercancellation } from "types/NXTAPI";
import { standardDeadline, standardFee } from "utils/common/constants";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

// &requestType=cancelAskOrder
// &order=15529445489307933067
// &secretPhrase=IWontTellYou

interface ICancelOrderPayload extends IAPICall {
  data: {
    order: string;
    secretPhrase: string;
    feeNQT: string;
    deadline: number;
  };
}

export async function cancelOpenOrder({ ...args }: IOrdercancellation) {
  let result;

  const requestType = args.orderType === "bid" ? "cancelBidOrder" : "cancelAskOrder";

  const options: ICancelOrderPayload = {
    url: BASEURL,
    method: "POST",
    requestType: requestType,
    data: {
      // args
      secretPhrase: args.secretPhrase,
      order: args.orderId,

      // standards
      feeNQT: standardFee,
      deadline: standardDeadline,
    },
  };

  try {
    result = await API(options);
  } catch (e) {
    console.error(`error in cancelOpenOrder() with orderType: ${args.orderType} and error: ${e}`);
    return false;
  }
  return result;
}
