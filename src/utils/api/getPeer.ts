//
// API call helper for getPeer, not meant to be called directly (meant to be used inside the APIProvider)
//

import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

/* nxt?=%2Fnxt
&requestType=getPeer
&peer=127.0.0.1 */

interface IGetBlocksPayload extends IAPICall {
  data: {
    peer: string;
  };
}

async function getBlocks(peer: string) {
  let result;

  const options: IGetBlocksPayload = {
    url: BASEURL,
    method: "POST",
    requestType: "getPeer",
    data: {
      peer: peer,
    },
  };

  try {
    result = await API(options);
    console.log("got peer:", result);
  } catch (e) {
    console.error("error getPeer():", e);
    return false;
  }
  return result;
}

export default getBlocks;
