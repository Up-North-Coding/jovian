//
// API call helper for getPeers, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IGetPeersResult } from "types/NXTAPI";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

/* nxt?=%2Fnxt
&requestType=getPeers */

async function getPeers(): Promise<IGetPeersResult> {
  let result;

  const options: IAPICall = {
    url: BASEURL,
    method: "GET",
    requestType: "getPeers",
  };

  try {
    result = await API(options);
  } catch (e) {
    console.error("error getPeers():", e);
    return {
      error: {
        message: "getPeers() error",
        code: -1,
      },
    };
  }
  return { results: result };
}

export default getPeers;
