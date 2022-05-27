import React, { memo } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { JUPGenesisTimestamp, userLocale } from "utils/common/constants";
import JUPTable from "components/JUPTable";
import useBlocks from "hooks/useBlocks";

// may no longer be needed but if I use createWidgetRow I might need to use it
export interface Data {
  date: string;
  blockHeight: string;
}

export interface IHeadCellProps {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: Array<IHeadCellProps> = [
  {
    id: "date",
    numeric: true,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "blockHeight",
    numeric: true,
    disablePadding: false,
    label: "Block #",
  },
];

const BlocksWidget: React.FC = () => {
  const { recentBlocks } = useBlocks();

  let blockRows;

  if (recentBlocks) {
    blockRows = recentBlocks.map((row, index) => {
      return (
        <TableRow hover tabIndex={-1} key={row.timestamp + "-" + index}>
          <TableCell align="right">
            {new Date(row.timestamp * 1000 + JUPGenesisTimestamp * 1000).toLocaleString(userLocale.localeStr, userLocale.options)}
          </TableCell>
          <TableCell align="right">{row.block}</TableCell>
        </TableRow>
      );
    });
  }

  if (blockRows === undefined) {
    return <></>;
  }

  return <JUPTable title={"Recent Blocks"} headCells={headCells} rows={blockRows}></JUPTable>;
};

export default memo(BlocksWidget);
