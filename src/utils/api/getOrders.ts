//
// API call helper for getBidOrders & getAskOrders, not meant to be called directly (meant to be used inside the APIProvider)
//

import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

// http://localhost:7876/nxt?
//   requestType=getBidOrders&
//   asset=17554243582654188572&
//   firstIndex=3&
//   lastIndex=3

// http://localhost:7876/nxt?
//   requestType=getAskOrders&
//   asset=17554243582654188572&
//   firstIndex=3&
//   lastIndex=3

interface IGetOrdersParams extends IAPICall {
  params: {
    asset: number;
  };
}

export async function getBidOrders(asset: number) {
  let result;

  const bidOptions: IGetOrdersParams = {
    url: BASEURL,
    method: "GET",
    requestType: "getBidOrders",
    params: {
      asset: asset,
    },
  };

  try {
    result = await API(bidOptions);
  } catch (e) {
    console.error("error getBidOrders():", e);
    return false;
  }
  return result.bidOrders;
}

export async function getAskOrders(asset: number) {
  let result;

  const askOptions: IGetOrdersParams = {
    url: BASEURL,
    method: "GET",
    requestType: "getAskOrders",
    params: {
      asset: asset,
    },
  };

  try {
    result = await API(askOptions);
  } catch (e) {
    console.error("error getAskOrders():", e);
    return false;
  }
  return result.askOrders;
}
