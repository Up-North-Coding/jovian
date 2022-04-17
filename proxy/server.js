const fetch = require("cross-fetch");
const express = require("express");
const app = express();

// app.use(express.json())
// app.use(express.urlencoded({extended: true}))

app.get("/nxt", async function (req, res) {
  console.log("[GET]", req.url);

  const result = await fetch("https://nodes.jup.io" + req.url, {
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
    referrer: "https://nodes.jup.io/test?requestTag=ACCOUNTS",

    body: null,
    method: "GET",
  });

  // console.log(await result.json())

  try {
    const json = await result.json();
    res.status(result.status);
    res.send(json);
  } catch (e) {
    res.status(result.status);
    // res.send('error caught' + e.message)
    res.send(await result.text());
  }
});

app.use((req, res, next) => {
  req.rawBody = "";
  req.on("data", (chunk) => {
    req.rawBody += chunk;
  });
  req.on("end", () => {
    try {
      req.body = JSON.parse(req.rawBody);
      next();
    } catch (err) {
      // console.log('Error parsing body')
      next();
    }
  });
});

app.post("/nxt", async function (req, res) {
  console.log("[POST]", req.url, req.rawBody);

  const result = await fetch("https://nodes.jup.io" + req.url, {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      Referer: "https://nodes.jup.io/",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Access-Control-Allow-Origin": "*",
    },
    body: req.rawBody,
    method: "POST",
  });

  try {
    const json = await result.json();
    res.status(result.status);
    res.send(json);
  } catch (e) {
    res.status(result.status);
    // res.send('error caught' + e.message)
    res.send(await result.text());
  }
});

app.listen(3080);
