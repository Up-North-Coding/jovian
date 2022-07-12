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
    quantityQNT: string;
    priceNQT: string;
    secretPhrase: string;
    feeNQT: string;
    deadline: number;
  };
}

export async function placeBidOrder(assetId: number, quantityQNT: string, priceNQT: string, secretPhrase: string) {
  let result;

  const options: IPlaceOrderPayload = {
    url: BASEURL,
    method: "POST",
    requestType: "placeBidOrder",
    data: {
      asset: assetId,
      quantityQNT: quantityQNT,
      priceNQT: priceNQT,
      secretPhrase: secretPhrase,
      feeNQT: standardFee,
      deadline: standardDeadline,
    },
  };

  try {
    result = await API(options);
  } catch (e) {
    console.error("error placeBidOrder():", e);
    return false;
  }
  return result;
}
