//
// API call helper for getAccountId, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IGetAccountIdResult } from "types/NXTAPI";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

export interface IGetAccountIdParams extends IAPICall {
  params: {
    publicKey: string;
  };
}

async function getAccountId(publicKey: string): Promise<IGetAccountIdResult> {
  let result;

  const options: IGetAccountIdParams = {
    url: BASEURL,
    method: "GET",
    requestType: "getAccountId",
    params: {
      publicKey: publicKey,
    },
  };

  try {
    result = await API(options);
  } catch (e) {
    console.error("error getAccountId():", e);
    return {
      error: {
        message: "getAccountId() error",
        code: -1,
      },
    };
  }
  return { results: result };
}

export default getAccountId;
