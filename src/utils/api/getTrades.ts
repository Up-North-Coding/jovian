//
// API call helper for getTrades, not meant to be called directly (meant to be used inside the APIProvider)
//

import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

/* &requestType=getTrades
&asset=2088497906655868238 */

interface IGetTradesPayload extends IAPICall {
  data: {
    asset: string;
    // account: string;
  };
}

async function getTrades(asset: string) {
  let result;

  const options: IGetTradesPayload = {
    url: BASEURL,
    method: "POST",
    requestType: "getTrades",
    data: {
      asset,
    },
  };

  try {
    result = await API(options);
    console.log("got trades result:", result);
  } catch (e) {
    console.error("error getTrades():", e);
    return false;
  }
  return result;
}

export default getTrades;
