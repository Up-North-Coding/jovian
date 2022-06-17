// allows for arbitrary keys
export interface ITableRow {
  [key: string]: string | number | React.ReactNode;
}

export interface IHeadCellProps {
  id: string;
  label: string;
  headAlignment: "left" | "right" | "center";
  rowAlignment: "left" | "right" | "center";
}

export { default } from "./JUPTable";
