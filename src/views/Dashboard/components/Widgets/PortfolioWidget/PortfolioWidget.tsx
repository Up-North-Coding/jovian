import React, { memo, useMemo } from "react";
import useMyTxs from "hooks/useMyTxs";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import { JUPGenesisTimestamp, LongUnitPrecision, userLocale } from "utils/common/constants";
import JUPTable, { IHeadCellProps, ITableRow } from "components/JUPTable";
import { Button, Stack } from "@mui/material";

const headCells: Array<IHeadCellProps> = [
  {
    id: "assetName",
    label: "Name",
    headAlignment: "center",
    rowAlignment: "right",
  },
  {
    id: "assetBalance",
    label: "Qty",
    headAlignment: "center",
    rowAlignment: "right",
  },
  {
    id: "actions",
    label: "Actions",
    headAlignment: "center",
    rowAlignment: "right",
  },
];

const PortfolioWidget: React.FC = () => {
  const { transactions } = useMyTxs();

  const portfolioRows: Array<ITableRow> | undefined = useMemo(() => {
    if (transactions === undefined || !Array.isArray(transactions)) {
      return undefined;
    }

    return transactions.map((transaction, index) => {
      return {
        assetName: "ASTRO",
        assetBalance: "temp balance",
        actions: (
          <Stack direction={"row"} spacing={2} justifyContent="center">
            <Button variant="green" onClick={() => console.log("implement send")}>
              Send
            </Button>
            <Button variant="green" onClick={() => console.log("implement copy")}>
              Copy
            </Button>
          </Stack>
        ),
      };
    });
  }, [transactions]);

  return (
    <JUPTable
      title={"My Portfolio"}
      path={"/portfolio"}
      headCells={headCells}
      rows={portfolioRows}
      defaultSortOrder="asc"
      keyProp={"assetName"}
    ></JUPTable>
  );
};

export default memo(PortfolioWidget);
