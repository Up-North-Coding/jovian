import React, { memo, useCallback, useMemo, useState } from "react";
import { Box, Link, Tab, Tabs } from "@mui/material";
import { JUPGenesisTimestamp, userLocale } from "utils/common/constants";
import JUPTable, { IHeadCellProps, ITableRow } from "components/JUPTable";
import useBlocks from "hooks/useBlocks";
import JUPDialog from "components/JUPDialog";
import AvgBlockTimeDisplay from "./components/AvgBlockTime";
import DailyTransactionsDisplay from "./components/DailyTransactionsDisplay";

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

const txDetailHeaders: Array<IHeadCellProps> = [
  {
    id: "tx_signature",
    label: "Tx Signature",
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
    id: "fullhash",
    label: "Full Hash",
    headAlignment: "center",
    rowAlignment: "center",
  },
];

interface IBlockDetail {
  height: number;
  headers: Array<IHeadCellProps>;
  rows: Array<ITableRow>;
}

interface ITransactionDetail {
  headers: Array<IHeadCellProps>;
  rows: Array<ITableRow>;
}

const BlocksWidget: React.FC = () => {
  const [tabId, setCurrentTabId] = React.useState(0);
  const [detailedDialogOpen, setDetailedDialogOpen] = useState(false);
  const [blockDetail, setBlockDetail] = useState<IBlockDetail | undefined>(undefined);
  const [transactionDetail, setTransactionDetail] = useState<ITransactionDetail | undefined>(undefined);
  const { recentBlocks, getBlockDetails } = useBlocks();

  const handleOpenBlockDetail = useCallback(
    async (height: number) => {
      const block = recentBlocks?.filter((x) => x.height === height)[0];

      setDetailedDialogOpen(true);
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
            label: "Details",
            headAlignment: "center",
            rowAlignment: "center",
          },
        ],
        rows: [
          {
            col1: "Block Height",
            col2: height,
          },
          {
            col1: "Block Signature",
            col2: block?.blockSignature,
          },
          {
            col1: "Transaction Count",
            col2: block?.numberOfTransactions,
          },
          {
            col1: "Generator",
            col2: block?.generatorRS,
          },
          {
            col1: "Generator Pubkey",
            col2: block?.generatorPublicKey,
          },
          {
            col1: "Prev Block Hash",
            col2: block?.previousBlockHash,
          },
          {
            col1: "Generation Signature",
            col2: block?.generationSignature,
          },
          {
            col1: "Version",
            col2: block?.version,
          },
        ],
      } as IBlockDetail);

      const detailedBlock = getBlockDetails !== undefined && block?.height !== undefined ? await getBlockDetails(block.height) : undefined;

      if (detailedBlock) {
        const txDetailsRows: Array<ITableRow> | undefined = detailedBlock?.transactions.map((tx) => {
          return {
            tx_signature: tx.signature,
            date: tx.timestamp,
            fullhash: tx.fullHash,
          };
        });

        if (txDetailsRows !== undefined) {
          setTransactionDetail({
            headers: txDetailHeaders,
            rows: txDetailsRows,
          });
        }
      }
    },
    [getBlockDetails, recentBlocks]
  );

  const handleCloseDialog = useCallback(() => {
    setDetailedDialogOpen(false);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTabId(newValue);
  };

  const blockOverviewRows: Array<ITableRow> | undefined = useMemo(() => {
    if (recentBlocks === undefined || !Array.isArray(recentBlocks)) {
      return undefined;
    }

    return recentBlocks.map((block) => {
      return {
        blockHeight: block.height.toString(),
        date: new Date(block.timestamp * 1000 + JUPGenesisTimestamp * 1000).toLocaleString(userLocale.localeStr, userLocale.options),
        blockHeight_ui: <Link onClick={() => handleOpenBlockDetail(block.height)}>{block.height}</Link>,
        txCount: block.numberOfTransactions.toString(),
        value: block.totalAmountNQT,
        generator: block.generatorRS,
        // TODO: move to constants, this value fixes an upstream calculation bug in the base target values
        baseTarget: Math.round(parseInt(block.baseTarget) / 153722867 / 10) + " %",
      };
    });
  }, [recentBlocks, handleOpenBlockDetail]);

  return (
    <>
      {/* Dialog for block details */}
      <JUPDialog title={`Detailed overview for block: ${blockDetail?.height}`} isOpen={detailedDialogOpen} closeFn={handleCloseDialog}>
        {/* TODO: for mobile use variant="fullWidth" */}
        <Tabs value={tabId} centered onChange={handleTabChange} aria-label="Detailed overview for block">
          <Tab label="Block Details" {...tabPropsById(0)} />
          <Tab label="Transaction Details" {...tabPropsById(1)} />
        </Tabs>

        <TabPanel value={tabId} index={0}>
          <JUPTable
            title={"Detailed View"}
            path={"/blocks"}
            headCells={blockDetail?.headers}
            rows={blockDetail?.rows}
            keyProp={"col1"}
            defaultSortOrder={"asc"}
            isPaginated={false}
          />
        </TabPanel>
        <TabPanel value={tabId} index={1}>
          <JUPTable
            title={"Transactions Detail"}
            path={"/transactions"}
            headCells={transactionDetail?.headers}
            rows={transactionDetail?.rows}
            keyProp={"tx_signature"}
            defaultSortOrder={"asc"}
            isPaginated={false}
          />
        </TabPanel>
      </JUPDialog>

      {/* Main recent blocks widget */}
      <JUPTable
        title={"Recent Blocks"}
        path={"/blocks"}
        headCells={blockOverviewHeaders}
        rows={blockOverviewRows}
        keyProp={"blockHeight"}
        isPaginated
        DisplayedComponents={[<AvgBlockTimeDisplay key={"avg-block-time-display"} />, <DailyTransactionsDisplay key={"avg-tx-display"} />]}
      ></JUPTable>
    </>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function tabPropsById(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default memo(BlocksWidget);
