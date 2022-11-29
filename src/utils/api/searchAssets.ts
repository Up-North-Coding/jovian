//
// API call helper for searchAssets, not meant to be called directly (meant to be used inside the APIProvider)
//
import { ISearchAssetsResult } from "../../types/NXTAPI";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

//searchAssets
//
// http://localhost:7876/nxt?
//   requestType=searchAssets&
//   query=assets AND production

interface ISearchAssetsPayload extends IAPICall {
  data: {
    query: string;
  };
}

async function searchAssets(queryString: string): Promise<ISearchAssetsResult> {
  let result;

  const options: ISearchAssetsPayload = {
    url: BASEURL,
    method: "POST",
    requestType: "searchAssets",
    data: {
      query: queryString,
    },
  };

  try {
    result = await API(options);
    console.log("got result from searching assets:", result);
  } catch (e) {
    console.error("error searchAssets():", e);
    return {
      error: {
        message: "searchAssets() error",
        code: -1,
      },
    };
  }
  return { results: result };
}

export default searchAssets;
