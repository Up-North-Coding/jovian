import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import useAPI from "hooks/useAPI";
import { IGetAccountCurrentOrdersResult, IOpenOrder } from "types/NXTAPI";
import useBlocks from "hooks/useBlocks";
import useAPIRouter from "hooks/useAPIRouter";
import useAccount from "hooks/useAccount";
import { LongUnitPrecision } from "utils/common/constants";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import { QtyPriceToTotal } from "utils/common/QtyPriceToTotal";

const orderTableColumns = ["Block Height", "Type", "Quantity", "Price", "Total", "Action"];

interface IOverallOrderHistoryProps {
  assetId?: string;
}

const MyOrderHistory: React.FC<IOverallOrderHistoryProps> = ({ assetId }) => {
  const [accountCurrentOrders, setAccountCurrentOrders] = useState<IGetAccountCurrentOrdersResult>();
  const { getTrades, getAccountCurrentOrders } = useAPI();
  const { cancelOpenOrder } = useAPIRouter();
  const { blockHeight } = useBlocks();
  const { accountRs } = useAccount();

  const handleCancelOpenOrder = useCallback(
    async (orderType: "bid" | "ask", orderId: string) => {
      if (cancelOpenOrder === undefined) {
        return;
      }

      await cancelOpenOrder(orderType, orderId);
    },
    [cancelOpenOrder]
  );

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
          <TableCell>{NQTtoNXT(openOrder.priceNQT, LongUnitPrecision)}</TableCell>
          <TableCell>{QtyPriceToTotal(openOrder.quantityQNT, openOrder.priceNQT.toString())}</TableCell>
          <TableCell>
            <Button variant="outlined" size="small" onClick={() => handleCancelOpenOrder(openOrder.type, openOrder.order)}>
              X
            </Button>
          </TableCell>
        </TableRow>
      );
    });
  }, [accountCurrentOrders, handleCancelOpenOrder]);

  return (
    <Table sx={{ border: "1px solid white" }}>
      <TableHead>{HeadCellsMemo}</TableHead>
      <TableBody>{RowDataMemo}</TableBody>
    </Table>
  );
};

export default memo(MyOrderHistory);
