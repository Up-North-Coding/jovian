//
// API call helper for getTrades, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IGetTradesResult } from "../../types/NXTAPI";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

/* &requestType=getTrades
&asset=6471156456525729821
&account=JUP-TEST-TEST-TEST-TESTT */

interface IGetTradesPayload extends IAPICall {
  data: {
    asset: string;
    account?: string;
  };
}

async function getTrades(asset: string, account?: string): Promise<IGetTradesResult> {
  let result;
  let data;

  if (account === undefined) {
    data = {
      asset: asset,
    };
  } else {
    data = {
      asset: asset,
      account: account,
    };
  }

  const options: IGetTradesPayload = {
    url: BASEURL,
    method: "POST",
    requestType: "getTrades",
    data: data,
  };

  try {
    result = await API(options);
    console.log("got trades result:", result);
  } catch (e) {
    console.error("error getTrades():", e);
    return {
      error: {
        message: "getTrades() error",
        code: -1,
      },
    };
  }
  return { results: result };
}

export default getTrades;
