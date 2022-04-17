import { API } from "./api";
import { BASEURL } from "./constants";

/*
 * http://localhost:7876/nxt?
 *   requestType=getAccount&
 *   account=NXT-4VNQ-RWZC-4WWQ-GVM8S
 */

async function getAccount(account: string) {
  let result;
  try {
    result = await API(`${BASEURL}requestType=getAccount&account=${account}`, "GET");
    console.log("API result:", result);
  } catch (e) {
    console.error("error getAccount():", e);
  }
}

export default getAccount;
