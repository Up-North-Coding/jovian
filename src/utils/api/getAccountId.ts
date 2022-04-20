//
// API call helper for getAccountId, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IGetAccountIdResult } from "types/NXTAPI";
import { API } from "./api";

async function getAccountId(publicKey: string): Promise<false | IGetAccountIdResult> {
  let result;
  try {
    result = await API(`requestType=getAccountId&publicKey=${publicKey}`, "GET");
  } catch (e) {
    console.error("error getAccount():", e);
    return false;
  }
  return result;
}

export default getAccountId;
