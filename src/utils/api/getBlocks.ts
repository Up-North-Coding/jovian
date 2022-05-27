//
// API call helper for getBlocks, not meant to be called directly (meant to be used inside the APIProvider)
//

import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

/* &requestType=getBlocks
&firstIndex=1000
&lastIndex=1001 */

interface IGetBlocksPayload extends IAPICall {
  data: {
    firstIndex: number;
    lastIndex: number;
  };
}

async function getBlocks(startBlock: number, endBlock: number) {
  let result;

  const options: IGetBlocksPayload = {
    url: BASEURL,
    method: "POST",
    requestType: "getBlocks",
    data: {
      firstIndex: startBlock,
      lastIndex: endBlock,
    },
  };

  try {
    result = await API(options);
  } catch (e) {
    console.error("error getBlocks():", e);
    return false;
  }
  return result;
}

export default getBlocks;
