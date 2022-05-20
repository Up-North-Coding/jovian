//
// API call helper for getBlockchainTransactions, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IGetBlockchainTransactionResult } from "types/NXTAPI";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

async function getBlockchainTransactions(account: string): Promise<false | IGetBlockchainTransactionResult> {
  let result;

  const options: IAPICall = {
    url: BASEURL,
    method: "GET",
    requestType: "getBlockchainTransactions",
    params: {
      account: account,
    },
  };

  try {
    result = await API(options);
  } catch (e) {
    console.error("error getBlockchainTransactions():", e);
    return false;
  }
  return result.transactions;
}

export default getBlockchainTransactions;
