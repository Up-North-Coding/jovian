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
  console.log("running:", method, "against:", url);
  let result;
  if (method === "GET") {
    result = await fetch(url, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "upgrade-insecure-requests": "1",
        "Access-Control-Allow-Origin": "*",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
    });
  } else {
    result = await fetch(url, {
      method,
      body: JSON.stringify(data),
    });
  }

  const jsonResult = await result.json();
  return jsonResult;
}

// await fetch("https://nodes.jup.io/nxt?requestType=getAccount", {
//     "credentials": "include",
//     "headers": {
//         "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:99.0) Gecko/20100101 Firefox/99.0",
//         "Accept": "*/*",
//         "Accept-Language": "en-US,en;q=0.5",
//         "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
//         "X-Requested-With": "XMLHttpRequest",
//         "Sec-Fetch-Dest": "empty",
//         "Sec-Fetch-Mode": "cors",
//         "Sec-Fetch-Site": "same-origin"
//     },
//     "referrer": "https://nodes.jup.io/test?requestTag=ACCOUNTS",
//     "body": "=%2Fnxt&requestType=getAccount&account=JUP-TEST-TEST-TEST-TESTT",
//     "method": "POST",
//     "mode": "cors"
// });
