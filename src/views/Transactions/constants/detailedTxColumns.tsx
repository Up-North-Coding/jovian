import { IHeadCellProps, ITableRow } from "components/JUPTable";
import { ITransaction } from "types/NXTAPI";
import { BigNumber } from "bignumber.js";
import { LongUnitPrecision } from "utils/common/constants";
import { NQTtoNXT } from "utils/common/NQTtoNXT";

export interface ITxDetail {
  txId: string; // the numerical version of the tx, not a hash
  headers: Array<IHeadCellProps>;
  rows: Array<ITableRow>;
}

export const detailedTxColumns = (tx: ITransaction) => {
  return {
    txId: tx?.transaction,
    headers: [
      {
        id: "col1",
        label: "Name",
        headAlignment: "center",
        rowAlignment: "center",
      },
      {
        id: "col2",
        label: "Details",
        headAlignment: "center",
        rowAlignment: "center",
      },
    ],
    rows: [
      {
        col1: "Hash",
        col2: tx.fullHash,
      },
      {
        col1: "Value",
        col2: tx?.amountNQT,
      },
      {
        col1: "Tx Attachment",
        col2: JSON.stringify(tx?.attachment),
      },
      {
        col1: "Block Id",
        col2: tx?.block,
      },
      {
        col1: "Block Height",
        col2: tx?.height,
      },
      {
        col1: "Confirmations",
        col2: tx?.confirmations,
      },
      {
        col1: "Fee",
        col2: NQTtoNXT(new BigNumber(tx?.feeNQT), LongUnitPrecision),
      },
      {
        col1: "Recipient Id",
        col2: tx?.recipient,
      },
      {
        col1: "Recipient Address",
        col2: tx?.recipientRS,
      },
      {
        col1: "Sender Id",
        col2: tx?.sender,
      },
      {
        col1: "Sender Address",
        col2: tx?.senderRS,
      },
      {
        col1: "Sender Public Key",
        col2: tx?.senderPublicKey,
      },
    ],
  } as ITxDetail;
};
