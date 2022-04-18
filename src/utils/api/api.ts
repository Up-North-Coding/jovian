import { BASEURL } from "./constants";
// A super simple (not finished) wrapper for NXT API calls

export interface IAPIResult {
  notsure: string;
}

export async function API<IAPIResult>(
  url: string,
  method: "GET" | "POST",
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  data?: any
) {
  let result;
  if (method === "GET") {
    result = await fetch(BASEURL + url);
  } else {
    result = await fetch(BASEURL + url, {
      method,
      body: JSON.stringify(data),
    });
  }

  const jsonResult = await result.json();
  return jsonResult;
}
