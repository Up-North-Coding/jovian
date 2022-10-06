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
      {
        col1: "Downloaded",
        col2: peer.downloadedVolume,
      },
      {
        col1: "Uploaded",
        col2: peer.uploadedVolume,
      },
      {
        col1: "Version",
        col2: peer.version,
      },
      {
        col1: "State",
        col2: peer.blockchainState,
      },
      {
        col1: "Blacklisted",
        col2: `${peer.blacklisted}`,
      },
    ],
  } as IPeerDetail;
};
