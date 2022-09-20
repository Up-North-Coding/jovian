import React, { memo, useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import useAPI from "hooks/useAPI";
import { IGetOrdersResult } from "types/NXTAPI";
import useBlocks from "hooks/useBlocks";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import { LongUnitPrecision } from "utils/common/constants";
import { PLACEHOLDERS } from "views/DEX/DEX";

interface IOrderbookProps {
  assetId?: string;
}
const OrderBook: React.FC<IOrderbookProps> = ({ assetId }) => {
  const { getOrders } = useAPI();
  const { blockHeight } = useBlocks();
  const [openOrders, setOpenOrders] = useState<IGetOrdersResult>();

  const bidOrderbookStyling: CSSProperties = {
    border: "2px solid green",
    overflowX: "hidden",
  };

  const askOrderbookStyling: CSSProperties = {
    border: "2px solid red",
    overflowX: "hidden",
  };

  // maps both bid and ask orders
  const RowsMemo = useMemo(() => {
    if (openOrders === undefined) {
      return;
    }

    const mappedAskOrders = openOrders?.asks.map((order, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{NQTtoNXT(order.priceNQT).toFixed(LongUnitPrecision)}</TableCell>
          <TableCell>{order.quantityQNT}</TableCell>
        </TableRow>
      );
    });

    const mappedBidOrders = openOrders?.bids.map((order, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{NQTtoNXT(order.priceNQT).toFixed(LongUnitPrecision)}</TableCell>
          <TableCell>{order.quantityQNT}</TableCell>
        </TableRow>
      );
    });

    return { asks: mappedAskOrders, bids: mappedBidOrders };
  }, [openOrders]);

  // set the orders for the current asset
  useEffect(() => {
    async function fetchOrders() {
      if (getOrders === undefined || assetId === undefined) {
        return;
      }

      try {
        const result = await getOrders(assetId);

        if (result) {
          setOpenOrders(result);
        }
      } catch (e) {
        console.error("error while getting orders in DEX component:", e);
        return;
      }
    }

    fetchOrders();
  }, [assetId, blockHeight, getOrders]);

  return (
    <>
      <TableContainer sx={askOrderbookStyling}>
        <Table size="small" padding="none">
          <TableHead>
            <TableCell>
              <Typography>Price</Typography>
            </TableCell>
            <TableCell>
              <Typography>Quantity</Typography>
            </TableCell>
          </TableHead>
          <TableBody>{RowsMemo?.asks}</TableBody>
        </Table>
      </TableContainer>

      <Typography>Last Price: {PLACEHOLDERS.lastPrice}</Typography>

      <TableContainer sx={bidOrderbookStyling}>
        <Table size="small" padding="none">
          <TableHead>
            <TableCell>
              <Typography>Price</Typography>
            </TableCell>
            <TableCell>
              <Typography>Quantity</Typography>
            </TableCell>
          </TableHead>
          <TableBody>{RowsMemo?.bids}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default memo(OrderBook);
