//
// API call helper for getBlocks, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IGetBlocksResult, IGetBlocksResultType } from "../../types/NXTAPI";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

/* &requestType=getBlocks
&firstIndex=1000
&lastIndex=1001 */

interface IGetBlocksPayload extends IAPICall {
  data: {
    firstIndex: number;
    lastIndex: number;
    includeTransactions: boolean;
  };
}

async function getBlocks(startBlock: number, endBlock: number, includeTransactions: boolean): Promise<IGetBlocksResult> {
  let result;

  const options: IGetBlocksPayload = {
    url: BASEURL,
    method: "POST",
    requestType: "getBlocks",
    data: {
      firstIndex: startBlock,
      lastIndex: endBlock,
      includeTransactions,
    },
  };

  try {
    if (startBlock > endBlock) {
      console.error("startBlock should always be < endBlock, returning early...");
      return {
        error: {
          message: "startBlock should always be < endBlock",
          code: -2,
        },
      };
    }

    result = (await API(options)) as IGetBlocksResultType;
  } catch (e) {
    console.error("error getBlocks():", e);
    return {
      error: {
        message: "getBlocks() error",
        code: -1,
      },
    };
  }

  console.log("getblocks result", result);
  return { results: result };
}

export default getBlocks;
