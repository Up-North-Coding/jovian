//
// API call helper for getBalance, not meant to be called directly (meant to be used inside the APIProvider)
//

import { API } from "./api";

/*
 * http://localhost:7876/nxt?
 *   requestType=getBalance&
 *   account=JUP-9J5L-9BX3-7HCX-AP3MK
 */

async function getBalance(account: string) {
  let result;
  try {
    result = await API(`requestType=getBalance&account=${account}`, "GET");
  } catch (e) {
    console.error("error getBalance():", e);
    return false;
  }
  return result;
}

export default getBalance;
