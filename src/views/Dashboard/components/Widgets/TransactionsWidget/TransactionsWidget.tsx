import React, { memo } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import useMyTxs from "hooks/useMyTxs";
import { ITransaction } from "types/NXTAPI";
import SLink from "components/SLink";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import { JUPGenesisTimestamp, unitPrecision, userLocale } from "utils/common/constants";

// may no longer be needed but if I use createWidgetRow I might need to use it
interface Data {
  date: string;
  qty: number;
  toFrom: string;
}

// might still want to use this concept
function createWidgetRow(date: string, qty: number, toFrom: string): Data {
  return {
    date,
    qty,
    toFrom,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof ITransaction>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
// function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
//   const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

interface IHeadCellProps {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

// TODO: remove "numeric" and "disablePadding" since they're all the same?
const headCells: readonly IHeadCellProps[] = [
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
    id: "toFrom",
    numeric: true,
    disablePadding: false,
    label: "To > From",
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const EnhancedTableToolbar = () => {
  return (
    <Toolbar>
      {
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle">
          <SLink href="/transactions">My Transactions</SLink>
        </Typography>
      }
      {/* {
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      } */}
    </Toolbar>
  );
};

const TransactionsWidget: React.FC = () => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("date");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const { transactions } = useMyTxs();

  let emptyRows;

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (transactions !== undefined) {
    // Avoid a layout jump when reaching the last page with empty rows.
    emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactions.length) : 0;
  } else {
    emptyRows = 0;
  }

  return (
    <Paper sx={{ margin: "10px" }}>
      <EnhancedTableToolbar />
      <TableContainer>
        <Table aria-labelledby="tableTitle" size={"small"}>
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={transactions?.length || 0} />
          <TableBody>
            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
            {transactions
              ?.slice()
              // .sort(getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover tabIndex={-1} key={row.timestamp}>
                    <TableCell align="right">
                      {new Date(row.timestamp * 1000 + JUPGenesisTimestamp * 1000).toLocaleString(userLocale.localeStr, userLocale.options)}
                    </TableCell>
                    {/* MUST: determine if this creates precision errors */}
                    <TableCell align="right">{NQTtoNXT(parseInt(row.amountNQT)).toFixed(unitPrecision)}</TableCell>
                    <TableCell align="right">{row.senderRS + " > " + row.recipientRS}</TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 33 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[3, 5]}
        component="div"
        count={transactions?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default memo(TransactionsWidget);
