// a super simple (not finished) wrapper for NXT API calls

export interface IAPIResult {
  notsure: string;
}

export async function API<IAPIResult>(url: string, method: "GET" | "POST", data?: any | {}) {
  const result = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    method: method,
    body: JSON.stringify(data),
  });
  const jsonResult = await result.json();
  return jsonResult;
}
