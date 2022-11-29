//
// API call helper for getAccountAssets, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IGetAccountAssetsResult } from "../../types/NXTAPI";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

/*
 * https://nodes.jup.io/nxt?=%2Fnxt
 * &requestType=getAccountAssets
 * &account=JUP-TEST-TEST-TEST-TESTT
 */

interface IGetAccountAssetsParams extends IAPICall {
  params: {
    account: string;
  };
}

async function getAccountAssets(account: string): Promise<IGetAccountAssetsResult> {
  let result;

  const options: IGetAccountAssetsParams = {
    url: BASEURL,
    method: "GET",
    requestType: "getAccountAssets",
    params: {
      account: account,
    },
  };

  try {
    result = await API(options);
  } catch (e) {
    console.error("error getAccountAssets():", e);
    return {
      error: {
        message: "getAccountAssets() error",
        code: -1,
      },
    };
  }
  return { results: result };
}

export default getAccountAssets;
