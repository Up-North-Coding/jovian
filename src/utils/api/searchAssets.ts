//
// API call helper for searchAssets, not meant to be called directly (meant to be used inside the APIProvider)
//
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

async function searchAssets(queryString: string) {
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
    return result;
  } catch (e) {
    console.error("error searchAssets():", e);
    return false;
  }
}

export default searchAssets;
