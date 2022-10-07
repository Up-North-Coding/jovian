import React, { memo, useCallback, useMemo, useState } from "react";
import { Box, Link, Tab, Tabs } from "@mui/material";
import { TimestampToDate } from "utils/common/Formatters";
import JUPTable, { IHeadCellProps, ITableRow } from "components/JUPTable";
import useBlocks from "hooks/useBlocks";
import JUPDialog from "components/JUPDialog";
import AvgBlockTimeDisplay from "./components/AvgBlockTime";
import DailyTransactionsDisplay from "./components/DailyTransactionsDisplay";
import { blockOverviewHeaders } from "./constants/blockOverviewHeaders";
import { txDetailHeaders } from "./constants/txDetailHeaders";
import { getBlockDetailHeaders, IBlockDetail } from "./constants/blockDetailHeaders";
import { useSnackbar } from "notistack";
import { messageText } from "utils/common/messages";

interface ITransactionDetail {
  headers: Array<IHeadCellProps>;
  rows: Array<ITableRow>;
}

const BlocksWidget: React.FC = () => {
  const [tabId, setCurrentTabId] = useState(0);
  const [detailedDialogOpen, setDetailedDialogOpen] = useState(false);
  const [blockDetail, setBlockDetail] = useState<IBlockDetail | undefined>(undefined);
  const [transactionDetail, setTransactionDetail] = useState<ITransactionDetail | undefined>(undefined);
  const { recentBlocks, getBlockDetails } = useBlocks();
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenBlockDetail = useCallback(
    async (height: number) => {
      const block = recentBlocks?.filter((x) => x.height === height)[0];

      if (block === undefined) {
        enqueueSnackbar(messageText.critical.noBlockDetailToDisplay, { variant: "error" });
        return;
      }

      setDetailedDialogOpen(true);
      setBlockDetail(getBlockDetailHeaders(height, block));

      const detailedBlock = getBlockDetails !== undefined && block?.height !== undefined ? await getBlockDetails(block.height) : undefined;

      if (detailedBlock) {
        const txDetailsRows: Array<ITableRow> | undefined = detailedBlock?.transactions.map((tx) => {
          return {
            date: TimestampToDate(tx.timestamp),
            tx_signature: tx.signature,
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
    [enqueueSnackbar, getBlockDetails, recentBlocks]
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
        date: TimestampToDate(block.timestamp),
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

interface ITabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<ITabPanelProps> = ({ index, value, children, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

function tabPropsById(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default memo(BlocksWidget);
