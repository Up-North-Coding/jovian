//
// API call helper for getAsset, not meant to be called directly (meant to be used inside the APIProvider)
//

import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

/*
 * https://nodes.jup.io/nxt?=%2Fnxt
 * &requestType=getAsset
 * &asset=7271075060743389472
 */

interface IGetAssetParams extends IAPICall {
  params: {
    asset: string;
  };
}

async function getAsset(assetId: string) {
  let result;

  const options: IGetAssetParams = {
    url: BASEURL,
    method: "GET",
    requestType: "getAsset",
    params: {
      asset: assetId,
    },
  };

  try {
    result = await API(options);
  } catch (e) {
    console.error("error getAsset():", e);
    return false;
  }
  return result;
}

export default getAsset;
