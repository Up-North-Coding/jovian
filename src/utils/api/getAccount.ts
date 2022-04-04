import { API } from "./api";
import { BASEURL } from "./constants";

// http://localhost:7876/nxt?
//   requestType=getAccount&
//   account=NXT-4VNQ-RWZC-4WWQ-GVM8S

function getAccount(account: string) {
  try {
    API(BASEURL + "requestType=getAccount&account=" + account, "GET");
  } catch (e) {
    console.error("error getAccount():", e);
  }
}

export default getAccount;
