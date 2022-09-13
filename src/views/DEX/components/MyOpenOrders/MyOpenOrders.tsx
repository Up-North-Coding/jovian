import React, { memo, useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import useAPI from "hooks/useAPI";
import { IGetAccountCurrentOrdersResult, IOpenOrder } from "types/NXTAPI";
import useBlocks from "hooks/useBlocks";
import useAccount from "hooks/useAccount";
import { LongUnitPrecision } from "utils/common/constants";
import { NQTtoNXT } from "utils/common/NQTtoNXT";

const orderTableColumns = ["Date", "Type", "Quantity", "Price", "Total"];

interface IOverallOrderHistoryProps {
  assetId?: string;
}

const MyOrderHistory: React.FC<IOverallOrderHistoryProps> = ({ assetId }) => {
  const [accountCurrentOrders, setAccountCurrentOrders] = useState<IGetAccountCurrentOrdersResult>();
  const { getTrades, getAccountCurrentOrders } = useAPI();
  const { blockHeight } = useBlocks();
  const { accountRs } = useAccount();

  // set the trade history for the current asset
  useEffect(() => {
    async function fetchAccountCurrentOrders() {
      if (assetId === undefined) {
        throw new Error("assetId prop is undefined, please pass an assetId to MyOrder History");
      }

      if (getAccountCurrentOrders === undefined || accountRs === undefined) {
        return;
      }

      try {
        const result = await getAccountCurrentOrders(assetId, accountRs);
        if (result) {
          setAccountCurrentOrders(result);
        }
      } catch (e) {
        console.error("error while getting trade history in DEX component:", e);
        return;
      }
    }

    fetchAccountCurrentOrders();
  }, [accountRs, assetId, blockHeight, getAccountCurrentOrders, getTrades]);

  const HeadCellsMemo = useMemo(() => {
    return orderTableColumns.map((column, index) => {
      return (
        <TableCell key={`th-${column}-${index}`}>
          <Typography>{column}</Typography>
        </TableCell>
      );
    });
  }, []);

  const RowDataMemo = useMemo(() => {
    if (accountCurrentOrders === undefined) {
      return;
    }

    // put the asks and bids together so we can map them together
    const allCurrentAccountOrders = accountCurrentOrders?.askOrders.concat(accountCurrentOrders?.bidOrders);

    if (allCurrentAccountOrders === undefined) {
      return (
        <>
          <Typography margin="20px">No orders for this asset from this account</Typography>
        </>
      );
    }

    return allCurrentAccountOrders.map((openOrder: IOpenOrder) => {
      return (
        <TableRow key={`tr-${openOrder.height}-${openOrder.order}`}>
          <TableCell>{openOrder.height}</TableCell>
          <TableCell>{openOrder.type}</TableCell>
          <TableCell>{openOrder.quantityQNT}</TableCell>
          <TableCell>{NQTtoNXT(openOrder.priceNQT).toFixed(LongUnitPrecision)}</TableCell>
          <TableCell>{"total"}</TableCell>
        </TableRow>
      );
    });
  }, [accountCurrentOrders]);

  return (
    <Table sx={{ border: "1px solid white" }}>
      <TableHead>{HeadCellsMemo}</TableHead>
      <TableBody>{RowDataMemo}</TableBody>
    </Table>
  );
};

export default memo(MyOrderHistory);
