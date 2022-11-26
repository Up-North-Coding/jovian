//
// A simple wrapper for NXT/JUP API calls
//

import { errorCheck } from "./common/errorValidation";
import { BASEREQBODY } from "./constants";

type Primitives = string | number | boolean;

interface ObjectWithStringKeys {
  // type of an object with string keys with value of type string, number or boolean
  [key: string]: Primitives;
}

export interface IAPICall extends RequestInit {
  url: string;
  requestType: string;
  params?: ObjectWithStringKeys;
  data?: ObjectWithStringKeys;
}

// UI -> send function -> api
// UI gathers the details needed
// send function takes in the params from the ui, adds any additionals (like timestamps?) and prepares the data
// api takes in the method, body and request type to send the request off, returning the results when available

export async function API(options: IAPICall): Promise<any> {
  let result: any;

  const finalURL = buildURL(options);

  if (options.method === "GET") {
    result = await fetch(finalURL);
  } else if (options.method === "POST") {
    if (options.data === undefined) {
      console.error("No payload provided to POST method. If this issue persists, please contact Jupiter admins.");
      return false;
    }
    const finalBody = buildBody(options);

    result = await fetch(finalURL, {
      method: options.method,
      headers: {
        accept: "*/*",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: finalBody,
    } as RequestInit);
  }

  const jsonResult = await result.json();

  errorCheck(jsonResult);

  return jsonResult;
}

//
// Helper functions
//

// Builds the URL, with or without URL params as needed
function buildURL(options: IAPICall) {
  const params = options.params;
  if (params) {
    let paramString = "";
    for (const [key, value] of Object.entries(params)) {
      paramString += "&" + key + "=" + encodeURIComponent(value);
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

  let payload = "";
  for (const [key, value] of Object.entries(options.data)) {
    payload += "&" + key + "=" + encodeURIComponent(value as Primitives);
  }

  return BASEREQBODY + options.requestType + payload;
}
