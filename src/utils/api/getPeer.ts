//
// API call helper for getPeer, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IGetPeerResult } from "../../types/NXTAPI";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

/* nxt?=%2Fnxt
&requestType=getPeer
&peer=127.0.0.1 */

interface IGetPeerPayload extends IAPICall {
  data: {
    peer: string;
  };
}

async function getPeer(peer: string): Promise<IGetPeerResult> {
  let result;

  const options: IGetPeerPayload = {
    url: BASEURL,
    method: "POST",
    requestType: "getPeer",
    data: {
      peer: peer,
    },
  };

  try {
    result = await API(options);
  } catch (e) {
    console.error("error getPeer():", e);
    return {
      error: {
        message: "getPeer() error",
        code: -1,
      },
    };
  }
  return { results: result };
}

export default getPeer;
