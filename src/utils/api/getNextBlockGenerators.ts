//
// API call helper for getNextBlockGenerators, not meant to be called directly (meant to be used inside the APIProvider)
// This call returns data about forging nodes
//

import { IGetNextBlockGeneratorsResult } from "types/NXTAPI";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

// nxt?=%2Fnxt
// &requestType=getNextBlockGenerators

async function getNextBlockGenerators(): Promise<IGetNextBlockGeneratorsResult> {
  let result;

  const options: IAPICall = {
    url: BASEURL,
    method: "GET",
    requestType: "getNextBlockGenerators",
  };

  try {
    result = await API(options);
  } catch (e) {
    console.error("error getNextBlockGenerators():", e);
    return {
      error: {
        message: "getNextBlockGenerators() error",
        code: -1,
      },
    };
  }
  return { results: result };
}

export default getNextBlockGenerators;
