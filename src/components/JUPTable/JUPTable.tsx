import React from "react";
import {
  Box,
  Paper,
  Slide,
  styled,
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
import { TransitionGroup } from "react-transition-group";
import SLink from "components/SLink";
import { visuallyHidden } from "@mui/utils";
import { DefaultTableRowsPerPage, DefaultTransitionTime, TableRowsPerPageOptions } from "utils/common/constants";

// allows for arbitrary keys
export interface ITableRow {
  [key: string]: string;
}

export interface IHeadCellProps {
  id: string;
  label: string;
  headAlignment: "left" | "right" | "center";
  rowAlignment: "left" | "right" | "center";
}

interface ITableTitleProps {
  title: string;
  path: string;
  DisplayedComponents?: Array<React.ReactElement>;
}

const TableTitle: React.FC<ITableTitleProps> = ({ title, path, DisplayedComponents }) => {
  return (
    <>
      <TitleText variant="h6" id="tableTitle">
        <SLink href={path}>{title}</SLink>
        {DisplayedComponents}
      </TitleText>
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

function getComparator(order: Order, orderBy: "toString" | "valueOf"): (a: ITableRow, b: ITableRow) => number {
  return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

interface IEnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
  headCells: Array<IHeadCellProps>;
}

const EnhancedTableHead: React.FC<IEnhancedTableProps> = ({ onRequestSort, order, orderBy, headCells }) => {
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {/* MUST: Memoize this */}
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.headAlignment} padding={"normal"} sortDirection={orderBy === headCell.id ? order : false}>
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
  rows: Array<ITableRow> | undefined;
  title: string;
  path: string;
  DisplayedComponents?: Array<React.ReactElement>;
}

const JUPTable: React.FC<IJUPTableProps> = ({ headCells, rows, title, path, DisplayedComponents }) => {
  const [rowsPerPage, setRowsPerPage] = React.useState(DefaultTableRowsPerPage);
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<any>("");
  const [page, setPage] = React.useState(0);
  let emptyRows;

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: string) => {
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
  } else {
    emptyRows = 0;
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <TableBackground>
      <TableContainer>
        <TableTitle title={title} path={path} DisplayedComponents={DisplayedComponents} />
        <Table aria-labelledby="tableTitle" size={"small"}>
          <EnhancedTableHead headCells={headCells} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {/* MUST: Memoize this (could the slice be a separate memo which is updated based on page flips?) */}
            {rows
              ?.sort(getComparator(order, orderBy))
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row, index) => {
                const cells = headCells.map((headCell, headIndex) => {
                  return (
                    <TableCell align={headCell.rowAlignment} key={`tc-${row[headCell.id]}-${index}-${headIndex}`}>
                      {row[headCell.id]}
                    </TableCell>
                  );
                });

                return (
                  <TransitionGroup key={"tg-" + index} component={null}>
                    <Slide direction="left" timeout={DefaultTransitionTime} appear={true}>
                      <TableRow hover tabIndex={-1} key={`tr-${index}-${JSON.stringify(row)}`}>
                        {cells}
                      </TableRow>
                    </Slide>
                  </TransitionGroup>
                );
              })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 33 * emptyRows,
                }}
              >
                <TableCell colSpan={headCells.length} />
              </TableRow>
            )}
          </TableBody>
        </Table>
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
    </TableBackground>
  );
};

const TableBackground = styled(Paper)(({ theme }) => ({
  margin: "10px",
}));

const TitleText = styled(Typography)(({ theme }) => ({
  margin: "10px",
}));

export default React.memo(JUPTable);
