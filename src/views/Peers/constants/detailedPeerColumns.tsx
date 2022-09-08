import { IHeadCellProps, ITableRow } from "components/JUPTable";
import { IPeerInfo } from "types/NXTAPI";

export interface IPeerDetail {
  nodeAddress: string; // the IP address of the peer
  headers: Array<IHeadCellProps>;
  rows: Array<ITableRow>;
}

export const detailedPeerColumns = (peer: IPeerInfo) => {
  return {
    nodeAddress: peer?.address,
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
        col1: "Peer IP",
        col2: peer.address,
      },
    ],
  } as IPeerDetail;
};
