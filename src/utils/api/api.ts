//
// A simple wrapper for NXT/JUP API calls
//

import { BASEREQBODY } from "./constants";

export interface IAPICall extends RequestInit {
  url: string;
  requestType: string;
  params?: any;
  data?: any;
}

// UI -> send function -> api
// UI gathers the details needed
// send function takes in the params from the ui, adds any additionals (like timestamps?) and prepares the data
// api takes in the method, body and request type to send the request off, returning the results when available

export async function API(options: IAPICall): Promise<any> {
  let result: any;
  // console.log("got options:", options);

  const finalURL = buildURL(options);

  if (options.method === "GET") {
    result = await fetch(finalURL);
  } else if (options.method === "POST") {
    if (options.data === undefined) {
      console.error("No payload provided to POST method. If this issue persists, please contact Jupiter admins.");
      return false;
    }
    const finalBody = buildBody(options);
    // console.log("finalBody:", finalBody);

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

// Builds the URL, with or without URL params as needed
function buildURL(options: IAPICall) {
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

// Builds the body. Currently handles a couple different formats but eventually these should be raised to the submitting code so the API code
// can be simplified even further
function buildBody(options: IAPICall) {
  if (options.data === undefined) {
    console.error("No data provided to buildBody(), this should be reported to Jupiter admins.");
    return;
  }
  const payloadKey = Object.keys(options.data)[0]; // TODO: is this okay?
  // console.log("building body with options:", options);

  // if the API call included the secretPhrase, append it to the body outside the main data payload for signTransaction
  // MUST: This isn't flexible enough but it works for now, will refactor again when it's time to do more POSTing
  if (options.data?.secretPhrase && options.requestType === "signTransaction") {
    const body =
      BASEREQBODY +
      options.requestType +
      "&" +
      payloadKey +
      "=" +
      encodeURIComponent(JSON.stringify(options.data[payloadKey])) +
      "&secretPhrase=" +
      encodeURIComponent(options.data.secretPhrase);

    console.log("built body:", body);
    return body;
  }

  if (options.requestType === "setAccountInfo") {
    let payload = "";
    for (const [key, value] of Object.entries(options.data)) {
      payload += "&" + key + "=" + encodeURIComponent(value as string | number | boolean);
    }
    const body = BASEREQBODY + options.requestType + payload;
    return body;
  }

  if (options.requestType === "getBlocks") {
    let payload = "";
    for (const [key, value] of Object.entries(options.data)) {
      payload += "&" + key + "=" + encodeURIComponent(value as string | number | boolean);
    }
    const body = BASEREQBODY + options.requestType + payload;
    return body;
  }

  const body = BASEREQBODY + options.requestType + "&" + payloadKey + "=" + encodeURIComponent(JSON.stringify(options.data[payloadKey]));
  console.log("built body:", body);
  return body;
}
