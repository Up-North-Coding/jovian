import { API } from "./api";
import { BASEURL } from "./constants";

// TODO: Implement signing (locally if possible)
// TODO: Implement broadcasting
// TODO: Implement validation

// sign
//
// http://localhost:7876/nxt?
//   requestType=signTransaction&
//   unsignedTransactionBytes=00100cfb3c03a00510f09c34f225d425306e5be55a494690...&
//   secretPhrase=SecretPhrase

// broadcast
//
// http://localhost:7876/nxt?
//   requestType=broadcastTransaction&
//   transactionBytes=001046aac6013c0057fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c143

// sendTransaction call to the API requires adminPassword so that cannot be used
function sendJUP(unsigned: string) {
  let signedTx: Promise<string> | undefined | "test";
  let isValid: boolean;
  try {
    // sign
    console.log("signing tx...");
    signedTx = signTx(unsigned);
    // validate
    isValid = validateTx(signedTx);
    // send
    if (isValid) {
      console.log("valid transaction, broadcasting not implemented yet. signedTx:", signedTx, "isValid:", isValid);
    }
    console.error("transaction invalid");
    return;
  } catch (e) {
    console.error("error sendJUP():", e);
  }
}

//
// Helper functions
//

function signTx(unsigned: string) {
  const secret = "test";

  let result;
  try {
    // result = API(BASEURL + "requestType=signTransaction&unsignedTransactionBytes=" + unsigned + "&secretPhrase=" + secret, "GET");
  } catch (e) {
    console.error("error while signing tx:", e);
    return;
  }
  return secret; // TODO: implement
}

function validateTx(signed?: string) {
  if (signed === undefined) {
    return false;
  }
  console.log("validating tx:", signed);

  if (signed === undefined) {
    console.error("signed transaction is undefined!!!!");
    return false;
  }

  return true; // TODO: implement
}

export default sendJUP;
