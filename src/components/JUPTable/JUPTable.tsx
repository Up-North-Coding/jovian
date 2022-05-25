import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import SLink from "components/SLink";
import React from "react";
import { ITransaction } from "types/NXTAPI";
import { visuallyHidden } from "@mui/utils";
import { TableRowsPerPageOptions } from "utils/common/constants";
import { Data, IHeadCellProps } from "views/Dashboard/components/Widgets/TransactionsWidget/TransactionsWidget";

// might still want to use this concept
// function createWidgetRow(date: string, qty: number, toFrom: string): Data {
//   return {
//     date,
//     qty,
//     toFrom,
//   };
// }

const TableTitle: React.FC = () => {
  return (
    <>
      {
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle">
          <SLink href="/transactions">My Transactions</SLink>
        </Typography>
      }
    </>
  );
};

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

interface IEnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: Array<IHeadCellProps>;
}

const EnhancedTableHead: React.FC<IEnhancedTableProps> = ({ onRequestSort, order, orderBy, rowCount, headCells }) => {
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
};

interface IJUPTableProps {
  headCells: Array<IHeadCellProps>;
  rows: Array<React.ReactElement>;
  children?: Array<React.ReactElement>;
}

const JUPTable: React.FC<IJUPTableProps> = ({ children, headCells, rows }) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<any>("date");
  const [page, setPage] = React.useState(0);
  let emptyRows;

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (rows !== undefined) {
    // Avoid a layout jump when reaching the last page with empty rows.
    emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    console.log("rows:", rows);
  } else {
    emptyRows = 0;
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Paper sx={{ margin: "10px" }}>
      <TableContainer>
        <TableTitle />
        <Table aria-labelledby="tableTitle" size={"small"}>
          <EnhancedTableHead headCells={headCells} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={rows?.length || 0} />
        </Table>
        <TableBody>
          {rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
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
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={TableRowsPerPageOptions}
        component="div"
        count={rows?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default React.memo(JUPTable);
