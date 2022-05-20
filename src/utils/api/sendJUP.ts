//
// API call helper for sendJUP, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IUnsignedTransaction, ISignedTransaction, IBroadcastTransactionResult, ISignedTransactionResult } from "types/NXTAPI";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

// TODO: Improve validation, should sanitize user input to ensure values are truly valid not that they just exist

// broadcast
//
// http://localhost:7876/nxt?
//   requestType=broadcastTransaction&
//   transactionBytes=001046aac6013c0057fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c143

async function sendJUP(unsigned: IUnsignedTransaction) {
  let signedTx: ISignedTransaction;
  let isValid: boolean;
  try {
    // sign
    signedTx = await signTx(unsigned);
    // validate
    isValid = validateTx(signedTx);
    console.log("isValid:", isValid);
    // broadcast
    if (isValid) {
      const broadcastResult = await broadcastTx(signedTx);
      if (broadcastResult) {
        return true;
      }
    }
    return false;
  } catch (e) {
    console.error("error sendJUP():", e);
    return false;
  }
}

//
// Helper functions
//

async function signTx(unsigned: IUnsignedTransaction) {
  console.log("preparing to sign JSON:", unsigned);

  let result: ISignedTransactionResult;

  const options: IAPICall = {
    url: BASEURL,
    method: "POST",
    requestType: "signTransaction",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    data: {
      unsignedTransactionJSON: unsigned,
      // secretPhrase: unsigned.secret,
    },
  };

  try {
    result = await API(options);
    if (result?.transactionJSON?.signature) {
      return { ...unsigned, signature: result.transactionJSON.signature }; // signing was a success, return the new object
    }

    console.log("got result from sign:", result);
  } catch (e) {
    console.error("error while signing tx:", e);
    return { ...unsigned, signature: "" };
  }
  return { ...unsigned, signature: "" };
}

function validateTx(signed?: ISignedTransaction) {
  if (signed === undefined) {
    return false;
  } else if (signed.signature == "") {
    console.log("no signature in transaction to be validated:", signed);
    return false; // might want to handle this differently
  }
  console.log("validating tx:", signed, "with signature:", signed.signature);

  return true;
}

async function broadcastTx(signed: ISignedTransaction): Promise<false | IBroadcastTransactionResult> {
  let result: IBroadcastTransactionResult;

  const options: IAPICall = {
    url: BASEURL,
    method: "POST",
    requestType: "broadcastTransaction",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      transactionJSON: signed,
    },
  };

  try {
    result = await API(options);

    // make sure the broadcast succeeded
    if (result.transaction) {
      console.log("broadcast tx:", result.transaction, "with hash:", result.fullHash);
      return result;
    }
    console.log("broadcast resulted in unexpected result, investigate this:", result);
  } catch (e) {
    console.error("error while signing tx:", e);
    return false;
  }
  return false;
}

export default sendJUP;
