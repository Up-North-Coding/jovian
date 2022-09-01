import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import WidgetContainer from "views/Dashboard/components/WidgetContainer";
import Page from "components/Page";
import Drawer from "../../components/Drawer";
import JUPAppBar from "components/JUPAppBar";
import JUPTable, { IHeadCellProps, ITableRow } from "components/JUPTable";
import { LongUnitPrecision } from "utils/common/constants";
import { TimestampToDate } from "utils/common/Formatters";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import useMyTxs from "hooks/useMyTxs";
import useBreakpoint from "hooks/useBreakpoint";
import { BigNumber } from "bignumber.js";
import { ITransaction } from "types/NXTAPI";
import { Link } from "@mui/material";
import JUPDialog from "components/JUPDialog";

const txOverviewHeaders: Array<IHeadCellProps> = [
  {
    id: "date_ui",
    label: "Date",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "qty",
    label: "Qty",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "fee",
    label: "Fee",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "from",
    label: "From",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "to",
    label: "To",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "height",
    label: "Height",
    headAlignment: "center",
    rowAlignment: "center",
  },
  {
    id: "confirmations",
    label: "Confirmations",
    headAlignment: "center",
    rowAlignment: "center",
  },
];

interface ITxDetail {
  hash: string;
  headers: Array<IHeadCellProps>;
  rows: Array<ITableRow>;
}

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

      setIsOpenTxDetail(true);
      setTxDetail({
        hash,
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
            col1: "Hash",
            col2: hash,
          },
          {
            col1: "Timestamp",
            col2: tx?.timestamp,
          },
        ],
      } as ITxDetail);
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
        qty: NQTtoNXT(new BigNumber(transaction.amountNQT)).toFixed(LongUnitPrecision),
        fee: transaction.feeNQT,
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
        <JUPDialog title={`Detailed overview for transaction: ${txDetail?.hash}`} isOpen={isOpenTxDetail} closeFn={handleCloseDialog}>
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
