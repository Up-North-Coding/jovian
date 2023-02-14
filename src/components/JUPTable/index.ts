// allows for arbitrary keys
export interface ITableRow {
  [key: string]: string | number | React.ReactNode;
}

export interface IHeadCellProps {
  id: string;
  label: string;
  sortType?: ISortTypes;
  headAlignment: "left" | "right" | "center";
  rowAlignment: "left" | "right" | "center";
}

// add new sorting types here for custom sort code in JupTable
// consider new sorting for: BigNumber, Date
export type ISortTypes = undefined | "number" | "string";

export { default } from "./JUPTable";
