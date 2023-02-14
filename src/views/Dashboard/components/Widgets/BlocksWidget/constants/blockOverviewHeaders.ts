import { IHeadCellProps } from "components/JUPTable";

export const blockOverviewHeaders: Array<IHeadCellProps> = [
  {
    id: "blockHeight_ui",
    label: "Block #",
    headAlignment: "center",
    rowAlignment: "center",
    sortType: "number",
  },
  {
    id: "date",
    label: "Date",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "txCount",
    label: "Tx Qty",
    headAlignment: "center",
    rowAlignment: "center",
    sortType: "number",
  },
  {
    id: "value",
    label: "Value",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "generator",
    label: "Generator",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "baseTarget",
    label: "Base Target",
    headAlignment: "center",
    rowAlignment: "center",
  },
];
