import { IHeadCellProps, ITableRow } from "components/JUPTable";
import { IBlock } from "types/NXTAPI";

export interface IBlockDetail {
  height: number;
  headers: Array<IHeadCellProps>;
  rows: Array<ITableRow>;
}
export const getBlockDetailHeaders = (height: number, block: IBlock) => {
  return {
    height,
    headers: [
      {
        id: "col1",
        label: "Name",
        headAlignment: "center",
        rowAlignment: "center",
        sortType: "string",
      },
      {
        id: "col2",
        label: "Details",
        headAlignment: "center",
        rowAlignment: "center",
        sortType: "string",
      },
    ],
    rows: [
      {
        col1: "Block Height",
        col2: height,
      },
      {
        col1: "Block Signature",
        col2: block?.blockSignature,
      },
      {
        col1: "Transaction Count",
        col2: block?.numberOfTransactions,
      },
      {
        col1: "Generator",
        col2: block?.generatorRS,
      },
      {
        col1: "Generator Pubkey",
        col2: block?.generatorPublicKey,
      },
      {
        col1: "Prev Block Hash",
        col2: block?.previousBlockHash,
      },
      {
        col1: "Generation Signature",
        col2: block?.generationSignature,
      },
      {
        col1: "Version",
        col2: block?.version,
      },
    ],
  } as IBlockDetail;
};
