import React, { memo, useCallback, useMemo, useState } from "react";
import { Chip, styled, Typography } from "@mui/material";
import { JUPGenesisTimestamp, ShortUnitPrecision, userLocale } from "utils/common/constants";
import JUPTable, { IHeadCellProps, ITableRow } from "components/JUPTable";
import useBlocks from "hooks/useBlocks";
import JUPDialog from "components/JUPDialog";

const AvgBlockTimeDisplay: React.FC = () => {
  const { avgBlockTime } = useBlocks();

  return <AvgBlockTimeChip label={`AVG Block Time: ${avgBlockTime?.toFixed(ShortUnitPrecision)} sec`} />;
};

const DailyTransactionsDisplay: React.FC = () => {
  const { dailyTxs } = useBlocks();

  return <AvgTxChip label={`24 Hr Txs: ${dailyTxs}`} />;
};

const blockOverviewHeaders: Array<IHeadCellProps> = [
  {
    id: "blockHeight_ui",
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

interface IBlockDetail {
  height:number;
  headers: Array<IHeadCellProps>;
  rows: Array<ITableRow>
}

const BlocksWidget: React.FC = () => {
  const { recentBlocks } = useBlocks();

  const [detailedDialogOpen, setDetailedDialogOpen] = useState(false)
  const [blockDetail, setBlockDetail] = useState<IBlockDetail | undefined>(undefined)

  const handleOpenBlockDetail = useCallback((height:number)=>{
    console.log('opening detailed block height dialog', height)

    const block = recentBlocks?.filter(x => x.height === height)[0]

    console.log('found block', block)

    setDetailedDialogOpen(true)
    setBlockDetail({
      height,
      headers: [
        {
          id: "col1",
          label: "Name",
          headAlignment: "center",
          rowAlignment: "center",
        },
        {
          id: "col2",
          label: "Value",
          headAlignment: "center",
          rowAlignment: "center",
        },
      ],
      rows: [
        {
          col1: "Block Height",
          col2: height
        },
        {
          col1: "Block Signature",
          col2: block?.blockSignature
        }
      ]
    } as IBlockDetail)
  }, [recentBlocks])

  const handleCloseDialog = useCallback(()=>{
    setDetailedDialogOpen(false)
  }, [])

  const blockOverviewRows: Array<ITableRow> | undefined = useMemo(() => {
    console.log("transactions testing", recentBlocks);
    if (recentBlocks === undefined || !Array.isArray(recentBlocks)) {
      return undefined;
    }

    return recentBlocks.map((block, index) => {
      return {
        date: new Date(block.timestamp * 1000 + JUPGenesisTimestamp * 1000).toLocaleString(userLocale.localeStr, userLocale.options),
        blockHeight: block.height.toString(),
        blockHeight_ui: (
          <a onClick={() => handleOpenBlockDetail(block.height)}>
          {block.height}
          </a>
          ),
        txCount: block.numberOfTransactions.toString(),
        value: block.totalAmountNQT,
        generator: block.generatorRS,
        baseTarget: Math.round(parseInt(block.baseTarget) / 153722867 / 10) + " %",
      };
    });
  }, [recentBlocks, handleOpenBlockDetail]);

  return (
    <>
      <JUPDialog title={`Detailed overview for block: ${blockDetail?.height}`} isOpen={detailedDialogOpen} closeFn={handleCloseDialog}>
        <JUPTable
        title={"Detailed View"}
        path={"/blocks"}
        headCells={blockDetail?.headers}
        rows={blockDetail?.rows}
        keyProp={"col1"}
        defaultSortOrder={"asc"}
      />
      </JUPDialog>

      <JUPTable
        title={"Recent Blocks"}
        path={"/blocks"}
        headCells={blockOverviewHeaders}
        rows={blockOverviewRows}
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
