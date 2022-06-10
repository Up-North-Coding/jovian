import React, { memo, useMemo } from "react";
import { Chip, styled } from "@mui/material";
import { JUPGenesisTimestamp, ShortUnitPrecision, userLocale } from "utils/common/constants";
import JUPTable, { IHeadCellProps, ITableRow } from "components/JUPTable";
import useBlocks from "hooks/useBlocks";

const AvgBlockTimeDisplay: React.FC = () => {
  const { avgBlockTime } = useBlocks();

  return <AvgBlockTimeChip label={`AVG Block Time: ${avgBlockTime?.toFixed(ShortUnitPrecision)} sec`} />;
};

const DailyTransactionsDisplay: React.FC = () => {
  const { dailyTxs } = useBlocks();

  return <AvgTxChip label={`24 Hr Txs: ${dailyTxs}`} />;
};

const headCells: Array<IHeadCellProps> = [
  {
    id: "blockHeight",
    label: "Block #",
    headAlignment: "center",
    rowAlignment: "center",
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

const BlocksWidget: React.FC = () => {
  const { recentBlocks } = useBlocks();

  const blockRows: Array<ITableRow> | undefined = useMemo(() => {
    console.log("transactions testing", recentBlocks);
    if (recentBlocks === undefined || !Array.isArray(recentBlocks)) {
      return undefined;
    }

    return recentBlocks.map((block, index) => {
      return {
        date: new Date(block.timestamp * 1000 + JUPGenesisTimestamp * 1000).toLocaleString(userLocale.localeStr, userLocale.options),
        blockHeight: block.height.toString(),
        txCount: block.numberOfTransactions.toString(),
        value: block.totalAmountNQT,
        generator: block.generatorRS,
        baseTarget: Math.round(parseInt(block.baseTarget) / 153722867 / 10) + " %",
      };
    });
  }, [recentBlocks]);

  return (
    <>
      <JUPTable
        title={"Recent Blocks"}
        path={"/blocks"}
        headCells={headCells}
        rows={blockRows}
        keyProp={"blockHeight"}
        DisplayedComponents={[<AvgBlockTimeDisplay key={"avg-block-time-display"} />, <DailyTransactionsDisplay key={"avg-tx-display"} />]}
      ></JUPTable>
    </>
  );
};

const AvgBlockTimeChip = styled(Chip)(({ theme }) => ({
  position: "relative",
  left: "50%",
  right: "50%",
  margin: "0px 10px",
}));

const AvgTxChip = styled(Chip)(({ theme }) => ({
  position: "relative",
  left: "50%",
  right: "50%",
  margin: "0px 10px",
}));

export default memo(BlocksWidget);
