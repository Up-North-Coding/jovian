//
// API call helper for setAccountInfo, not meant to be called directly (meant to be used inside the APIProvider)
//
import { API, IAPICall } from "./api";
import { standardDeadline, standardFee } from "utils/common/constants";
import { BASEURL } from "./constants";
import { ISetAccountInfo, ISetAccountInfoResult } from "types/NXTAPI";

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

async function setAccountInfo({ ...args }: ISetAccountInfo): Promise<ISetAccountInfoResult> {
  let result;

  const options: ISetAccountInfoPayload = {
    url: BASEURL,
    method: "POST",
    requestType: "setAccountInfo",
    data: {
      // args
      secretPhrase: args.secretPhrase,
      name: args.name,
      description: args.description,

      // standards
      feeNQT: standardFee,
      deadline: standardDeadline,
    },
  };

  try {
    result = await API(options);
    console.log("got result from setting account info:", result);
    return { results: { status: true, requestProcessingTime: result.requestProcessingTime } };
  } catch (e) {
    console.error("error setAccountInfo():", e);
    return { error: { message: "setAccountInfo() error", code: -1 } };
  }
}

export default setAccountInfo;
