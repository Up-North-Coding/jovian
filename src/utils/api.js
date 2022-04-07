// not used for now, but a super simple (not finished) wrapper for NXT API calls

const API = async (url, data) => {
  const result = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const jsonResult = await result.json();
  return jsonResult;
};
