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
  } catch (e) {
    console.error("error getAccount():", e);
    return;
  }
  return result;
}

export default getAccount;
