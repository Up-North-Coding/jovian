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

export function buildTx({ ...args }: any) {
  console.log("preparing a tx with args:", args);
  const defaultTxDetails = {
    senderPublicKey: args.senderPubKey,
    senderRS: args.senderRS,
    feeNQT: standardFee,
    version: standardTransactionVersion,
    phased: standardPhasedSetting,
    type: args.type,
    subtype: args.subtype,
    attachment: args.attachment,
    amountNQT: args.amountNQT,
    recipientRS: args.recipientRS,
    recipient: args.recipient,
    ecBlockHeight: standardECBlockheight,
    deadline: standardDeadline,
    timestamp: standardTimestamp,
    secretPhrase: args.secretPhrase,
  };
  return defaultTxDetails;
}
