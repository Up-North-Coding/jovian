import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@mui/material";
import WidgetContainer from "views/Dashboard/components/WidgetContainer";
import Page from "components/Page";
import Drawer from "../../components/Drawer";
import JUPAppBar from "components/JUPAppBar";
import JUPTable, { ITableRow } from "components/JUPTable";
import JUPDialog from "components/JUPDialog";
import { ITransaction } from "types/NXTAPI";
import { LongUnitPrecision } from "utils/common/constants";
import { TimestampToDate } from "utils/common/Formatters";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import useMyTxs from "hooks/useMyTxs";
import useBreakpoint from "hooks/useBreakpoint";
import { BigNumber } from "bignumber.js";
import { detailedTxColumns, ITxDetail } from "./constants/detailedTxColumns";
import { txOverviewHeaders } from "./constants/txOverviewHeaders";

const Transactions: React.FC = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(true);
  const [isOpenTxDetail, setIsOpenTxDetail] = useState<boolean>(false);
  const [txDetail, setTxDetail] = useState<ITxDetail | undefined>();

  const isMobileMedium = useBreakpoint("<", "md");
  const { transactions } = useMyTxs();

  const handleDrawerToggle = useCallback(() => {
    setDrawerIsOpen((prev: boolean) => !prev);
  }, []);

  const handleOpenTxDetail = useCallback(
    (hash: string) => {
      const tx = transactions?.filter((transaction) => transaction.fullHash === hash)[0];

      if (!tx) {
        console.error("No detailed tx to open...");
        return;
      }
      setIsOpenTxDetail(true);
      setTxDetail(detailedTxColumns(tx));
    },
    [transactions]
  );

  const txRows: Array<ITableRow> | undefined = useMemo(() => {
    if (transactions === undefined || !Array.isArray(transactions)) {
      return undefined;
    }

    return transactions.map((transaction: ITransaction) => {
      return {
        fullHash: transaction.fullHash,
        date: transaction.timestamp,
        date_ui: <Link onClick={() => handleOpenTxDetail(transaction.fullHash)}>{TimestampToDate(transaction.timestamp)}</Link>,
        qty: NQTtoNXT(new BigNumber(transaction.amountNQT), LongUnitPrecision),
        fee: NQTtoNXT(new BigNumber(transaction.feeNQT), LongUnitPrecision),
        from: transaction.senderRS,
        to: transaction.recipientRS,
        height: transaction.height,
        confirmations: transaction.confirmations,
      };
    });
  }, [handleOpenTxDetail, transactions]);

  const handleCloseDialog = useCallback(() => {
    setIsOpenTxDetail(false);
  }, []);

  // sets the drawer state when the mobile breakpoint is hit
  useEffect(() => {
    if (isMobileMedium) {
      setDrawerIsOpen(false);
      return;
    }
    setDrawerIsOpen(true);
  }, [isMobileMedium]);

  return (
    <Page>
      <Drawer isSidebarExpanded={drawerIsOpen} />
      <JUPAppBar toggleFn={handleDrawerToggle} isSidebarExpanded={drawerIsOpen} />
      <WidgetContainer isSidebarExpanded={drawerIsOpen}>
        {/* Dialog for block details */}
        <JUPDialog title={`Detailed overview for transaction: ${txDetail?.txId}`} isOpen={isOpenTxDetail} closeFn={handleCloseDialog}>
          <JUPTable keyProp={"col1"} headCells={txDetail?.headers} rows={txDetail?.rows} defaultSortOrder={"asc"} isPaginated={false}></JUPTable>
        </JUPDialog>

        <JUPTable
          title={"My Transactions"}
          path={"/transactions"}
          headCells={txOverviewHeaders}
          rows={txRows}
          defaultSortOrder="asc"
          keyProp={"fullHash"}
          rowsPerPageStyle="long"
          isPaginated
        />
      </WidgetContainer>
    </Page>
  );
};

export default memo(Transactions);
