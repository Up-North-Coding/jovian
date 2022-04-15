import { IUnsignedTransaction } from "views/Dashboard/Dashboard";
import { API } from "./api";
import { BASEURL } from "./constants";

export interface ISignedTransaction extends IUnsignedTransaction {
  signature: string;
}

// TODO: Implement signing (locally if possible)
// TODO: Implement broadcasting
// TODO: Implement validation

// sign
//
// http://localhost:7876/nxt?
//   requestType=signTransaction&
//   unsignedTransactionBytes=00100cfb3c03a00510f09c34f225d425306e5be55a494690...&
//   secretPhrase=SecretPhrase

// example unsigned tx, redacted
//
// {"senderPublicKey":"abc",
// "feeNQT":"5000",
// "type":0,
// "version":1,
// "phased":false,
// "ecBlockId":"123",
// "attachment":{"version.OrdinaryPayment":0},
// "senderRS":"JUP-XXXX-XXXX-XXXX-XXXXX",
// "subtype":0,"amountNQT":"100000000000",
// "sender":"123",
// "recipientRS":"JUP-XXXX-XXXX-XXXX-XXXXX",
// "recipient":"123",
// "ecBlockHeight":0,
// "deadline":1440,
// "timestamp":141421180,
// "height":2147483647}

// signed tx example (redacted)
//
// {"senderPublicKey":"123",
// "feeNQT":"5000",
// "type":0,
// "version":1,
// "phased":false,
// "ecBlockId":"123",
// "attachment":{"version.OrdinaryPayment":0},
// "senderRS":"JUP-ABCD-ABCD-ABCD-ABCDE",
// "subtype":0,
// "amountNQT":"100000000000",
// "sender":"123",
// "recipientRS":"JUP-ABCD-ABCD-ABCD-ABCDE",
// "recipient":"123",
// "ecBlockHeight":0,
// "deadline":1440,
// "timestamp":141423231,
// "height":2147483647,
// "signature":"abc123"}

// broadcast
//
// http://localhost:7876/nxt?
//   requestType=broadcastTransaction&
//   transactionBytes=001046aac6013c0057fb6f3a958e320bb49c4e81b4c2cf28b9f25d086c143

// sendTransaction call to the API requires adminPassword so that cannot be used
function sendJUP(unsigned: IUnsignedTransaction) {
  let signedTx: ISignedTransaction | undefined;
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

function signTx(unsigned: IUnsignedTransaction) {
  const secret = "test";

  let result;
  try {
    // result = API(BASEURL + "requestType=signTransaction&unsignedTransactionBytes=" + unsigned + "&secretPhrase=" + secret, "GET");
  } catch (e) {
    console.error("error while signing tx:", e);
    return;
  }
  return { ...unsigned, signature: "test" }; // TODO: implement
}

function validateTx(signed?: ISignedTransaction) {
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
