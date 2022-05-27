import React, { memo } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import useMyTxs from "hooks/useMyTxs";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import { JUPGenesisTimestamp, unitPrecision, userLocale } from "utils/common/constants";
import JUPTable from "components/JUPTable";

// may no longer be needed but if I use createWidgetRow I might need to use it
export interface Data {
  date: string;
  qty: number;
  fromTo: string;
}

// might still want to use this concept
// function createWidgetRow(date: string, qty: number, toFrom: string): Data {
//   return {
//     date,
//     qty,
//     toFrom,
//   };
// }

export interface IHeadCellProps {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

// TODO: remove "numeric" and "disablePadding" since they're all the same?
const headCells: Array<IHeadCellProps> = [
  {
    id: "date",
    numeric: true,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "qty",
    numeric: true,
    disablePadding: false,
    label: "Qty",
  },
  {
    id: "fromTo",
    numeric: true,
    disablePadding: false,
    label: "From > To",
  },
];

const TransactionsWidget: React.FC = () => {
  const { transactions } = useMyTxs();

  let txRows;

  if (transactions) {
    txRows = transactions.map((row, index) => {
      return (
        <TableRow hover tabIndex={-1} key={row.timestamp + "-" + index}>
          <TableCell align="right">
            {new Date(row.timestamp * 1000 + JUPGenesisTimestamp * 1000).toLocaleString(userLocale.localeStr, userLocale.options)}
          </TableCell>
          {/* MUST: determine if this creates precision errors */}
          <TableCell align="right">{NQTtoNXT(parseInt(row.amountNQT)).toFixed(unitPrecision)}</TableCell>
          <TableCell align="right">{row.senderRS + " > " + row.recipientRS}</TableCell>
        </TableRow>
      );
    });
  }

  if (txRows === undefined) {
    return <></>;
  }

  return <JUPTable title={"My Transactions"} path={"/transactions"} headCells={headCells} rows={txRows}></JUPTable>;
};

export default memo(TransactionsWidget);
