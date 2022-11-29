//
// API call helper for getAccountCurrentBidOrders & getAccountCurrentAskOrders, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IGetAccountCurrentAskOrdersResult, IGetAccountCurrentBidOrdersResult } from "../../types/NXTAPI";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

// &requestType=getAccountCurrentBidOrders
// &account=JUP-TEST-TEST-TEST-TESTT
// &asset=6471156456525729821

// &requestType=getAccountCurrentAskOrders
// &account=JUP-TEST-TEST-TEST-TESTT
// &asset=6471156456525729821

interface IGetAccountCurrentOrdersParams extends IAPICall {
  params: {
    asset: string;
    account: string;
  };
}

export async function getAccountCurrentBidOrders(asset: string, account: string): Promise<IGetAccountCurrentBidOrdersResult> {
  let result;

  const bidOptions: IGetAccountCurrentOrdersParams = {
    url: BASEURL,
    method: "GET",
    requestType: "getAccountCurrentBidOrders",
    params: {
      asset: asset,
      account: account,
    },
  };

  try {
    result = await API(bidOptions);
  } catch (e) {
    console.error("error getAccountCurrentBidOrders():", e);
    return {
      error: {
        message: "getAccountCurrentBidOrders() error",
        code: -1,
      },
    };
  }
  return { results: result };
  // return result.bidOrders;
}

export async function getAccountCurrentAskOrders(asset: string, account: string): Promise<IGetAccountCurrentAskOrdersResult> {
  let result;

  const askOptions: IGetAccountCurrentOrdersParams = {
    url: BASEURL,
    method: "GET",
    requestType: "getAccountCurrentAskOrders",
    params: {
      asset: asset,
      account: account,
    },
  };

  try {
    result = await API(askOptions);
  } catch (e) {
    console.error("error getAccountCurrentAskOrders():", e);
    return {
      error: {
        message: "getAccountCurrentAskOrders() error",
        code: -1,
      },
    };
  }
  return { results: result };
  // return result.askOrders;
}
