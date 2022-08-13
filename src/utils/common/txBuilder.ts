//
// Builds various transaction types based on inputs
//

import {
  standardDeadline,
  standardECBlockheight,
  standardFee,
  standardPhasedSetting,
  standardTimestamp,
  standardTransactionVersion,
} from "./constants";

export function buildTx({ ...args }) {
  console.log("preparing a tx with args:", args);
  const defaultTxDetails = {
    // args:
    senderPublicKey: args.senderPublicKey,
    senderRS: args.senderRS,
    type: args.type,
    subtype: args.subtype,
    attachment: args.attachment,
    amountNQT: args.amountNQT,
    recipientRS: args.recipientRS,
    recipient: args.recipient,
    secretPhrase: args.secretPhrase,

    // defaults:
    ecBlockHeight: standardECBlockheight,
    deadline: standardDeadline,
    timestamp: standardTimestamp(),
    feeNQT: standardFee,
    version: standardTransactionVersion,
    phased: standardPhasedSetting,
  };
  return defaultTxDetails;
}
