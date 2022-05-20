//
// API call helper for getBlockchainStatus, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IGetBlockchainStatusResult } from "types/NXTAPI";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

async function getBlockchainStatus(): Promise<false | IGetBlockchainStatusResult> {
  let result;

  const options: IAPICall = {
    url: BASEURL,
    method: "GET",
    requestType: "getBlockchainStatus",
  };

  try {
    result = await API(options);
  } catch (e) {
    console.error("error getBlockchainStatus():", e);
    return false;
  }
  return result;
}

export default getBlockchainStatus;
