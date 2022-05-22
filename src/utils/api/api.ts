//
// A super simple (not finished) wrapper for NXT API calls
//

import { ISignedTransaction, IUnsignedTransaction } from "types/NXTAPI";
import { BASEREQBODY } from "./constants";

export interface IAPICall extends RequestInit {
  url: string;
  requestType: string;
  params?: IGetAccountParams | IGetBalanceParams | IGetAccountIdParams | IGetBlockchainTransactionsParams | ISendJUPParams;
  data?: ISetAccountInfoPayload | ISignTransactionPayload | IBroadcastTransactionPayload;
}

interface IGetAccountParams {
  account: string;
}

interface IGetBalanceParams {
  account: string;
}

interface IGetAccountIdParams {
  publicKey: string;
}

interface IGetBlockchainTransactionsParams {
  account: string;
}

interface ISendJUPParams {
  transactionJSON: string;
  secretPhrase: string;
}

interface ISetAccountInfoPayload {
  secretPhrase: string;
  name?: string;
  description?: string;
  feeNQT: string;
  deadline: number;
}

interface ISignTransactionPayload {
  unsignedTransactionJSON: IUnsignedTransaction;
}

interface IBroadcastTransactionPayload {
  transactionJSON: any;
}

// UI -> send function -> api
// UI gathers the details needed
// send function takes in the params from the ui, adds any additionals (like timestamps?) and prepares the data
// api takes in the method, body and request type to send the request off, returning the results when available

export async function API(options: any): Promise<any> {
  let result: any;

  const finalURL = buildURL(options);

  if (options.method === "GET") {
    result = await fetch(finalURL);
  } else {
    console.log(`prepping to ${options.method} with data: ${JSON.stringify(options.data)} to URL: ${finalURL}`);

    const finalBody =
      BASEREQBODY +
      options.requestType +
      "&" +
      Object.keys(options.data)[0] + // TODO: is this okay?
      "=" +
      encodeURIComponent(JSON.stringify(options.data.unsignedTransactionJSON)) +
      "&secretPhrase=" +
      encodeURIComponent(options.data.unsignedTransactionJSON.secretPhrase);

    console.log("final body just before fetch: ", finalBody);
    result = await fetch(finalURL, {
      method: options.method,
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: finalBody,
    } as RequestInit);
  }

  const jsonResult = await result.json();
  return jsonResult;
}

//
// Helper functions
//

function buildURL(options: any) {
  let paramString = "&";
  const params = options.params;
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      paramString = paramString + key + "=" + value;
    }
    return options.url + "requestType=" + options.requestType + paramString;
  }

  // URL params not needed for POST
  return options.url + "requestType=" + options.requestType;
}
