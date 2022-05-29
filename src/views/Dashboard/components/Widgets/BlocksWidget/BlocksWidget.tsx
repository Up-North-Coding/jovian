import React, { memo } from "react";
import { TableCell, TableRow, Slide, Chip, styled } from "@mui/material";
import { DefaultTransitionTime, JUPGenesisTimestamp, ShortUnitPrecision, userLocale } from "utils/common/constants";
import JUPTable from "components/JUPTable";
import useBlocks from "hooks/useBlocks";
import { TransitionGroup } from "react-transition-group";

const AvgBlockTimeDisplay: React.FC = () => {
  const { avgBlockTime } = useBlocks();

  return <AvgBlockTimeChip label={`AVG Block Time: ${avgBlockTime?.toFixed(ShortUnitPrecision)} sec`} />;
};

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

// const headCells: Array<IHeadCellProps> = [
const headCells: any = [
  {
    id: "blockHeight",
    numeric: true,
    disablePadding: false,
    label: "Block #",
  },
  {
    id: "date",
    numeric: true,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "txCount",
    numeric: true,
    disablePadding: false,
    label: "Tx Qty",
  },
  {
    id: "value",
    numeric: true,
    disablePadding: false,
    label: "Value",
  },
  {
    id: "generator",
    numeric: true,
    disablePadding: false,
    label: "Generator",
  },
  {
    id: "baseTarget",
    numeric: true,
    disablePadding: false,
    label: "Base Target",
  },
];

const BlocksWidget: React.FC = () => {
  const { recentBlocks } = useBlocks();

  let blockRows;

  if (recentBlocks) {
    blockRows = recentBlocks.map((row, index) => {
      return (
        // Slide transition isn't working quite yet. It does work on initial page load and when toggling row count
        //  so maybe a memo needs to be involved?
        <TransitionGroup key={"tg-" + index} component={null}>
          <Slide direction="left" timeout={DefaultTransitionTime} appear={true}>
            <TableRow hover tabIndex={-1} key={row.timestamp + "-" + index}>
              <TableCell align="right">{row.height}</TableCell>
              <TableCell align="right">
                {new Date(row.timestamp * 1000 + JUPGenesisTimestamp * 1000).toLocaleString(userLocale.localeStr, userLocale.options)}
              </TableCell>
              <TableCell align="right">{row.numberOfTransactions}</TableCell>
              <TableCell align="right">{row.totalAmountNQT}</TableCell>
              <TableCell align="right">{row.generatorRS}</TableCell>
              {/* baseTarget row is not ideal but it fixes an upstream calculation error due to JUP's block time changes over time */}
              <TableCell align="right">{Math.round(parseInt(row.baseTarget) / 153722867 / 10) + " %"}</TableCell>
            </TableRow>
          </Slide>
        </TransitionGroup>
      );
    });
  }

  if (blockRows === undefined) {
    return <></>;
  }

  return (
    <>
      <JUPTable
        title={"Recent Blocks"}
        path={"/blocks"}
        headCells={headCells}
        rows={blockRows}
        DisplayedComponent={<AvgBlockTimeDisplay />}
      ></JUPTable>
    </>
  );
};

const AvgBlockTimeChip = styled(Chip)(({ theme }) => ({
  position: "relative",
  left: "50%",
  right: "50%",
}));

export default memo(BlocksWidget);
