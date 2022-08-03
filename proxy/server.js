/* eslint-env node */

const fetch = require("cross-fetch");
const express = require("express");
const app = express();

// app.use(express.json())
// app.use(express.urlencoded({extended: true}))

// TODO: Encode URL params to avoid possible issues with unsupported chars (like spaces)

// Set a higher threadpool size than default (4) to avoid ETIMEDOUT due to blocking threads during DNS lookups
process.env.UV_THREADPOOL_SIZE = 20;

let counter = 0;
// const BASEURL = "https://nodes.jup.io"; // prod url
const BASEURL = "https://test.jup.io"; // test url

console.log("starting server with url:", BASEURL);

app.use((req, res, next) => {
  // proxy: initiator -> proxy -> target api
  // disable cors in the proxy responses back to the initiating requestor
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/test", (req, res) => {
  res.send("hello there");
});

app.get("/nxt", async function (req, res) {
  console.log(`${counter} [GET]`, req.url);
  counter++;

  const result = await fetch(BASEURL + req.url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      pragma: "no-cache",
    },

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
    let text = "";
    try {
      text = await result.text();
    } catch (e) {
      console.error("[GET] error", e);
      text = "[GET] error";
    }

    res.send(text);
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
  console.log(`${counter} [POST]`, req.url, JSON.stringify(req.rawBody));
  counter++;

  const result = await fetch(BASEURL + req.url, {
    headers: {
      host: BASEURL.split("https://")[0],
      "Sec-Ch-Ua": "(Not(A:Brand;v=8, Chromium;v=101",
      "Sec-Ch-Ua-Mobile": "?0",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
      "Sec-Ch-Ua-Platform": "macOS",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "*/*",
      Origin: BASEURL,
      "Sec-Fetch-Site": "same-site",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      Referer: "https://nodes.jup.io/test",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "en-US,en;q=0.9",
      Connection: "close",
    },
    body: req.rawBody,
    method: "POST",
    mode: "no-cors",
  });

  try {
    const json = await result.json();
    res.status(result.status);
    res.send(json);
  } catch (e) {
    res.status(result.status);
    // res.send('error caught' + e.message)
    let text = "";
    try {
      text = await result.text();
    } catch (e) {
      text = "[POST] error";
      console.error("[POST] error", e);
    }

    res.send(text);
  }
});

app.listen(3080, "0.0.0.0");
