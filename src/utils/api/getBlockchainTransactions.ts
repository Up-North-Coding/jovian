//
// API call helper for getBlockchainTransactions, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IGetBlockchainTransactionResult } from "types/NXTAPI";
import { API } from "./api";

async function getBlockchainTransactions(account: string): Promise<false | IGetBlockchainTransactionResult> {
  let result;
  try {
    result = await API(`requestType=getBlockchainTransactions&account=${account}`, "GET");
  } catch (e) {
    console.error("error getBlockchainTransactions():", e);
    return false;
  }
  return result.transactions;
}

export default getBlockchainTransactions;
