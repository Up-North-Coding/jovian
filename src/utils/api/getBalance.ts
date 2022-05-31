//
// API call helper for getBalance, not meant to be called directly (meant to be used inside the APIProvider)
//

import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

/*
 * http://localhost:7876/nxt?
 *   requestType=getBalance&
 *   account=JUP-9J5L-9BX3-7HCX-AP3MK
 */

interface IGetBalanceParams extends IAPICall {
  params: {
    account: string;
  };
}

async function getBalance(account: string) {
  let result;

  const options: IGetBalanceParams = {
    url: BASEURL,
    method: "GET",
    requestType: "getBalance",
    params: {
      account: account,
    },
  };

  try {
    result = await API(options);
  } catch (e) {
    console.error("error getBalance():", e);
    return false;
  }
  return result;
}

export default getBalance;
