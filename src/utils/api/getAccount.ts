import { API } from "./api";

/*
 * http://localhost:7876/nxt?
 *   requestType=getAccount&
 *   account=JUP-9J5L-9BX3-7HCX-AP3MK
 */

async function getAccount(account: string) {
  let result;
  try {
    result = await API(`requestType=getAccount&account=${account}`, "GET");
    console.log("full result:", result);

    // Trying to figure out how to work with my error/success types, maybe they can't be separated like that
    // this is due to the way the API happily returns errors on http code 200
    if (result?.errorCode) {
      return false;
    }
  } catch (e) {
    console.error("error getAccount():", e);
    return false;
  }
  return result;
}

export default getAccount;
