//
// API call helper for setAccountInfo, not meant to be called directly (meant to be used inside the APIProvider)
//
import { API } from "./api";
import { standardDeadline, standardFee } from "utils/common/constants";

//setAccountInfo
//
// http://localhost:7876/nxt?
//   requestType=setAccountInfo&
//   secretPhrase=IWontTellYou&
//   name=iwonttellyou
//   description=example account
//   feeNQT=100000000&
//   deadline=60

async function setAccountInfo(secret: string, accountName: string, accountDescr: string) {
  let result;
  try {
    result = await API(
      "requestType=setAccountInfo&secretPhrase=" +
        secret +
        "&name=" +
        accountName +
        "&description=" +
        accountDescr +
        "&feeNQT=" +
        standardFee +
        "&deadline=" +
        standardDeadline,
      "POST"
    );
    console.log("got result from setting account info:", result);
    return result;
  } catch (e) {
    console.error("error setAccountInfo():", e);
    return false;
  }
}

export default setAccountInfo;
