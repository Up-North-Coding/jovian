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
  const result = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    method,
    body: JSON.stringify(data),
  });
  const jsonResult = await result.json();
  return jsonResult;
}
