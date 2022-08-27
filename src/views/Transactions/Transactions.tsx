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

const headCells: Array<IHeadCellProps> = [
  {
    id: "date",
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

const Transactions: React.FC = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(true);
  const isMobileMedium = useBreakpoint("<", "md");
  const { transactions } = useMyTxs();

  const handleDrawerToggle = useCallback(() => {
    setDrawerIsOpen((prev: boolean) => !prev);
  }, []);

  const txRows: Array<ITableRow> | undefined = useMemo(() => {
    if (transactions === undefined || !Array.isArray(transactions)) {
      return undefined;
    }

    return transactions.map((transaction: ITransaction) => {
      return {
        fullHash: transaction.fullHash,
        date: TimestampToDate(transaction.timestamp),
        qty: NQTtoNXT(new BigNumber(transaction.amountNQT)).toFixed(LongUnitPrecision),
        fee: transaction.feeNQT,
        from: transaction.senderRS,
        to: transaction.recipientRS,
        height: transaction.height,
        confirmations: transaction.confirmations,
      };
    });
  }, [transactions]);

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
        <JUPTable
          title={"My Transactions"}
          path={"/transactions"}
          headCells={headCells}
          rows={txRows}
          defaultSortOrder="asc"
          keyProp={"fullHash"}
          isPaginated
        />
      </WidgetContainer>
    </Page>
  );
};

export default memo(Transactions);
