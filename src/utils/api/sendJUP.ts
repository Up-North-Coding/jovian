//
// API call helper for sendJUP, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IUnsignedTransaction } from "views/Dashboard/Dashboard";
import { API } from "./api";

export interface ISignedTransaction extends IUnsignedTransaction {
  signature: string;
}

// TODO: Implement validation
// TODO: Implement broadcasting

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
async function sendJUP(unsigned: IUnsignedTransaction) {
  let signedTx: any;
  let isValid: boolean;
  try {
    // sign
    signedTx = await signTx(unsigned);
    // validate
    isValid = validateTx(signedTx);
    console.log("isValid:", isValid);
    // // send
    // if (isValid) {
    //   console.log("valid transaction, broadcasting not implemented yet. signedTx:", signedTx, "isValid:", isValid);
    //   API("requestType=signTransaction", "GET");
    //   return;
    // }
    // console.error("transaction invalid");
    return;
  } catch (e) {
    console.error("error sendJUP():", e);
  }
}

//
// Helper functions
//

async function signTx(unsigned: any) {
function signTx(unsigned: IUnsignedTransaction) {
  const secret = "test"; // TODO: implement

  console.log("preparing to sign JSON:", unsigned);

  let result;
  try {
    result = await API("requestType=signTransaction&unsignedTransactionJSON=" + JSON.stringify(unsigned) + "&secretPhrase=" + secret, "GET");
    if (result.transactionJSON.signature) {
      return { ...unsigned, signature: result.transactionJSON.signature }; // signing was a success, return the new object
    }

    console.log("got result from sign:", result);
  } catch (e) {
    console.error("error while signing tx:", e);
    return;
  }
  return { ...unsigned }; // signing wasn't successul
}

function validateTx(signed?: any) {
  if (signed === undefined) {
    return false;
  } else if (signed.signature === undefined) {
    console.log("no signature in transaction to be validated:", signed);
    return false; // might want to handle this differently
  }
  console.log("validating tx:", signed, "with signature:", signed.signature);

  if (signed === undefined) {
    console.error("signed transaction is undefined!!!!");
    return false;
  }

  return true;
}

export default sendJUP;
