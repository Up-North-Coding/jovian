import { API } from "./api";
import { BASEURL } from "./constants";

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

function sendJUP(unsigned: string) {
  let signedTx: Promise<string> | undefined;
  let isValid: boolean;
  try {
    // sign
    console.log("signing tx...");
    signedTx = signTx(unsigned);
    // validate
    isValid = validateTx(signedTx);
    // send

    if (isValid) {
      console.log("valid transaction, broadcasting not implemented yet", signedTx, isValid);
    }
  } catch (e) {
    console.error("error sendJUP():", e);
  }
}

//
// Helper functions
//

function signTx(unsigned: any) {
  const secret = "test";

  let result;
  try {
    // result = API(BASEURL + "requestType=signTransaction&unsignedTransactionBytes=" + unsigned + "&secretPhrase=" + secret, "GET");
  } catch (e) {
    console.error("error while signing tx:", e);
    return;
  }
  return result;
}

function validateTx(signed: any) {
  console.log("validating tx:", signed);

  if (signed === undefined) {
    console.error("signed transaction is undefined!!!!");
    return false;
  }

  return false; // TODO: implement
}

export default sendJUP;
