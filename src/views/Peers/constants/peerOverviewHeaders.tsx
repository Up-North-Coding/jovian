import { IHeadCellProps } from "components/JUPTable";

export const peerOverviewHeaders: Array<IHeadCellProps> = [
  {
    id: "nodeAddress_ui",
    label: "Node IP",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "downloaded",
    label: "Downloaded",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "uploaded",
    label: "Uploaded",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "version",
    label: "Version",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "state",
    label: "State",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "blacklisted",
    label: "Blacklisted",
    headAlignment: "center",
    rowAlignment: "center",
  },
];
