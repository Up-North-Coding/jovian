//
// API call helper for getBlock (gets a single block with transaction details optionally included), not meant to be called directly (meant to be used inside the APIProvider)
//

import { IGetBlockResult } from "../../types/NXTAPI";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

/* &requestType=getBlock
&height=1000
&includeTransactions=true */

interface IGetBlocksPayload extends IAPICall {
  data: {
    height: number;
    includeTransactions: boolean;
  };
}

async function getBlock(height: number, includeTransactions: boolean): Promise<IGetBlockResult> {
  let result;

  const options: IGetBlocksPayload = {
    url: BASEURL,
    method: "POST",
    requestType: "getBlock",
    data: {
      height,
      includeTransactions,
    },
  };

  try {
    result = await API(options);
  } catch (e) {
    console.error("error getBlock():", e);
    return {
      error: {
        message: "getBlock() error",
        code: -1,
      },
    };
  }

  return { results: result };
}

export default getBlock;
