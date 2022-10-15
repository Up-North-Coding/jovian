// TODO: Make this configurable based on prod/dev run status

// Dev
// export const BASEURL = "http://localhost:3080/nxt?"; // proxy runs on 3080 by default
// export const BASEURL = "http://<insert dev pc IP for mobile testing>:3080/nxt?"; // proxy runs on 3080 by default (for public testing)

// Testnet
export const BASEURL = "https://test.jup.io/nxt?";

// Production
// export const BASEURL = "https://nodes.jup.io/nxt?";

export const BASEREQBODY = "=%2Fnxt&requestType="; // all req bodies start this way
