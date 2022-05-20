//
// A super simple (not finished) wrapper for NXT API calls
//

import { ISignedTransaction, IUnsignedTransaction } from "types/NXTAPI";

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
  // secretPhrase: string;
}

interface IBroadcastTransactionPayload {
  transactionJSON: any;
}

// "body": "=%2Fnxt&requestType=signTransaction&unsignedTransactionJSON=%7B%22senderPublicKey%22%3A%226b2f8c81acd93352b2d0ec8fcdef38e9e6f061c76551b87ac2cfffa9e855a435%22%2C%22senderRS%22%3A%22JUP-QUXP-4HAG-XHW3-9CDQ9%22%2C%22feeNQT%22%3A%225000%22%2C%22version%22%3A1%2C%22phased%22%3Afalse%2C%22type%22%3A0%2C%22subtype%22%3A0%2C%22attachment%22%3A%7B%22version.OrdinaryPayment%22%3A0%7D%2C%22amountNQT%22%3A%221%22%2C%22recipientRS%22%3A%22JUP-QUXP-4HAG-XHW3-9CDQ9%22%2C%22recipient%22%3A%228347820017649937333%22%2C%22ecBlockHeight%22%3A0%2C%22deadline%22%3A1440%2C%22timestamp%22%3A143838586%2C%22secret%22%3A%22mystery+sail+quiet+revenge+vast+process+illuminate+desperate+thunder+visit+wrist+odd%22%7D&secretPhrase=mystery+sail+quiet+revenge+vast+process+illuminate+desperate+thunder+visit+wrist+odd",
export async function API(options: any): Promise<any> {
  let result: any;

  const finalURL = buildURL(options);

  if (options.method === "GET") {
    result = await fetch(finalURL);
  } else {
    console.log(`prepping to ${options.method} with data: ${JSON.stringify(options.data)} and URL: ${finalURL}`);

    const finalBody =
      "=%2Fnxt&requestType=" +
      options.requestType +
      "&" +
      "unsignedTransactionJSON=" +
      encodeURIComponent(JSON.stringify(options.data.unsignedTransactionJSON));

    console.log("proposed body: " + finalBody);
    result = await fetch(finalURL, {
      method: options.method,
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
