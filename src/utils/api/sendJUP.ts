//
// API call helper for sendJUP, not meant to be called directly (meant to be used inside the APIProvider)
//

import {
  IUnsignedTransaction,
  ISignedTransaction,
  IBroadcastTransactionResult,
  ISignedTransactionResult,
  IAssetTransferAttachment,
  ISendJupResult,
} from "types/NXTAPI";
import { sendValidation } from "utils/validation";
import { API, IAPICall } from "./api";
import { BASEURL } from "./constants";

export interface ISignTransactionPayload extends IAPICall {
  data: {
    unsignedTransactionJSON: string;
    secretPhrase: string;
  };
}

export interface IBroadcastTransactionPayload extends IAPICall {
  data: {
    transactionJSON: string;
  };
}

// TODO: Improve validation, should sanitize user input to ensure values are truly valid not that they just exist

// broadcast
//
// http://localhost:7876/nxt?
//   requestType=broadcastTransaction&
//   transactionBytes=001046aac6013c0057fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c143

// BUG: sending fails when the user doesn't have an on-chain publicKey. this only occurs
// when the account is brand new and has not sent any transactions yet
async function sendJUP(unsigned: IUnsignedTransaction): Promise<ISendJupResult> {
  let signedTx: ISignedTransaction;
  let isValid: boolean;
  let sendQty: string;

  // set the appropriate quantity based on transaction type
  if (Object.keys(unsigned.attachment).includes("quantityQNT")) {
    sendQty = (unsigned.attachment as IAssetTransferAttachment).quantityQNT;
  } else {
    sendQty = unsigned.amountNQT;
  }

  try {
    // input validate
    if (!sendValidation(sendQty)) {
      console.error(`invalid input value while trying to send: ${unsigned.amountNQT}`);
      return { results: false };
    }
    // sign
    signedTx = await signTx(unsigned);
    // validate
    isValid = validateTx(signedTx);
    console.log("isValid:", isValid);
    // broadcast
    if (isValid) {
      const broadcastResult = await broadcastTx(signedTx);
      if (broadcastResult) {
        return { results: true };
      }
    }
    return { results: false };
  } catch (e) {
    console.error("error sendJUP():", e);
    return { error: { message: "sendJUP() error", code: -1 } };
  }
}

//
// Helper functions
//

async function signTx(unsigned: IUnsignedTransaction) {
  let result: ISignedTransactionResult;

  const options: ISignTransactionPayload = {
    url: BASEURL,
    method: "POST",
    requestType: "signTransaction",
    data: {
      unsignedTransactionJSON: JSON.stringify(unsigned as IUnsignedTransaction),
      secretPhrase: unsigned.secretPhrase,
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

  const options: IBroadcastTransactionPayload = {
    url: BASEURL,
    method: "POST",
    requestType: "broadcastTransaction",
    data: {
      transactionJSON: JSON.stringify(signed as ISignedTransaction),
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
    console.error("error while broadcasting tx:", e);
    return false;
  }
  return false;
}

export default sendJUP;
