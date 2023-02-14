/// <reference types="cypress" />
import { IHeadCellProps, ITableRow } from ".";
import JUPTable from "./JUPTable";

// TODO:
// [ ] Test empty rows
// [ ] Test populated rows
// [ ] Test with/without title & associated link
// [ ] Test with/without displayed components
// [ ] Test sorting
// [ ] Test with/without pagination
// [ ] Test short and long page style

// interface IJUPTableProps {
//   title?: string;
//   headCells?: Array<IHeadCellProps>;
//   rows?: Array<ITableRow>;
//   path?: string;
//   DisplayedComponents?: Array<React.ReactElement>;
//   defaultSortOrder?: Order;
//   rowsPerPageStyle?: "short" | "long"; // determines which page row quantity options are presented to the user
//   isPaginated?: boolean;
//   keyProp: string; // This prop gets used to build a unique key
//   EmptyRowPlaceholder?: string | React.NamedExoticComponent; // component/string to display when no row data is present
// }

const testHeaders: Array<IHeadCellProps> = [
  {
    id: "col1",
    label: "Column 1",
    headAlignment: "center",
    rowAlignment: "left",
  },
];

const testRowsFull: Array<ITableRow> = [
  {
    col1: "12345",
  },
];

const testRowsEmpty = [];

describe("JUP Table", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<JUPTable keyProp={"col1"} rows={testRowsFull} headCells={testHeaders} />);
  });
});
