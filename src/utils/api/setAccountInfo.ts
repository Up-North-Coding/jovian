//
// API call helper for setAccountInfo, not meant to be called directly (meant to be used inside the APIProvider)
//
import { API, IAPICall } from "./api";
import { standardDeadline, standardFee } from "utils/common/constants";
import { BASEURL } from "./constants";

//setAccountInfo
//
// http://localhost:7876/nxt?
//   requestType=setAccountInfo&
//   secretPhrase=IWontTellYou&
//   name=iwonttellyou
//   description=example account
//   feeNQT=100000000&
//   deadline=60

interface ISetAccountInfoPayload extends IAPICall {
  data: {
    secretPhrase: string;
    name?: string;
    description?: string;
    feeNQT: string;
    deadline: number;
  };
}

async function setAccountInfo(secret: string, accountName: string, accountDescr: string) {
  let result;

  const options: ISetAccountInfoPayload = {
    url: BASEURL,
    method: "POST",
    requestType: "setAccountInfo",
    data: {
      secretPhrase: secret,
      name: accountName,
      description: accountDescr,
      feeNQT: standardFee,
      deadline: standardDeadline,
    },
  };

  try {
    result = await API(options);
    console.log("got result from setting account info:", result);
    return result;
  } catch (e) {
    console.error("error setAccountInfo():", e);
    return false;
  }
}

export default setAccountInfo;
