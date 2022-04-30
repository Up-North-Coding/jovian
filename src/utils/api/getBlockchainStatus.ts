//
// API call helper for getBlockchainStatus, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IGetBlockchainStatusResult } from "types/NXTAPI";
import { API } from "./api";

async function getBlockchainStatus(): Promise<false | IGetBlockchainStatusResult> {
  let result;
  try {
    result = await API(`requestType=getBlockchainStatus`, "GET");
  } catch (e) {
    console.error("error getBlockchainStatus():", e);
    return false;
  }
  return result;
}

export default getBlockchainStatus;
