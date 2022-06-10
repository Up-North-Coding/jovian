import React, { memo, useEffect, useMemo } from "react";
import useMyTxs from "hooks/useMyTxs";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import { JUPGenesisTimestamp, LongUnitPrecision, userLocale } from "utils/common/constants";
import JUPTable from "components/JUPTable";
import { IHeadCellProps, ITableRow } from "components/JUPTable/JUPTable";

const headCells: Array<IHeadCellProps> = [
  {
    id: "date",
    label: "Date",
    headAlignment: "center",
    rowAlignment: "right",
  },
  {
    id: "qty",
    label: "Qty",
    headAlignment: "center",
    rowAlignment: "right",
  },
  {
    id: "fromTo",
    label: "From > To",
    headAlignment: "center",
    rowAlignment: "right",
  },
];

const TransactionsWidget: React.FC = () => {
  const { transactions } = useMyTxs();

  const txRows: Array<ITableRow> | undefined = useMemo(() => {
    if (transactions === undefined || !Array.isArray(transactions)) {
      return undefined;
    }

    return transactions.map((transaction, index) => {
      return {
        fullHash: transaction.fullHash,
        date: new Date(transaction.timestamp * 1000 + JUPGenesisTimestamp * 1000).toLocaleString(userLocale.localeStr, userLocale.options),
        qty: NQTtoNXT(parseInt(transaction.amountNQT)).toFixed(LongUnitPrecision),
        fromTo: `${transaction.senderRS} > ${transaction.recipientRS}`,
      };
    });
  }, [transactions]);

  return (
    <JUPTable
      title={"My Transactions"}
      path={"/transactions"}
      headCells={headCells}
      rows={txRows}
      defaultSortOrder="asc"
      keyProp={"fullHash"}
    ></JUPTable>
  );
};

export default memo(TransactionsWidget);
