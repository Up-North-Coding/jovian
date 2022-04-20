//
// API call helper for sendJUP, not meant to be called directly (meant to be used inside the APIProvider)
//

import { IUnsignedTransaction, ISignedTransaction, IBroadcastTransactionResult } from "types/NXTAPI";
import { API } from "./api";

// TODO: Improve validation
//        - Should validation run before signing in order to report input flaws to the user? probably
// TODO: Implement broadcasting

// broadcast
//
// http://localhost:7876/nxt?
//   requestType=broadcastTransaction&
//   transactionBytes=001046aac6013c0057fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c143

// sendTransaction call to the API requires adminPassword so that cannot be used
async function sendJUP(unsigned: IUnsignedTransaction) {
  let signedTx: ISignedTransaction;
  let isValid: boolean;
  try {
    // sign
    signedTx = await signTx(unsigned);
    // validate
    isValid = validateTx(signedTx);
    console.log("isValid:", isValid);
    // // broadcast
    if (isValid) {
      console.log("valid transaction, broadcasting not implemented yet. signedTx:", signedTx, "isValid:", isValid);
      broadcastTx(signedTx);
      return true;
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
    return { ...unsigned, signature: "" };
  }
  return { ...unsigned, signature: "" };
}

function validateTx(signed?: ISignedTransaction) {
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

async function broadcastTx(signed: ISignedTransaction): Promise<false | IBroadcastTransactionResult> {
  let result;
  try {
    result = await API("requestType=broadcastTransaction&transactionJSON=" + JSON.stringify(signed), "POST");
    console.log("got result from broadcast:", result);

    // make sure the broadcast succeeded
    if (result.transaction) {
      return result;
    }
  } catch (e) {
    console.error("error while signing tx:", e);
    return false;
  }
  return false;
}

export default sendJUP;
