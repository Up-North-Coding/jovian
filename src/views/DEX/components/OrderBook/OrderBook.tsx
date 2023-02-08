import React, { memo, useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import useAPI from "hooks/useAPI";
import { IAsset, IGetOrdersResult } from "types/NXTAPI";
import useBlocks from "hooks/useBlocks";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import { LongUnitPrecision } from "utils/common/constants";
import { QNTtoNXT } from "utils/common/QNTtoNXT";
import { BigNumber } from "bignumber.js";

interface IOrderbookProps {
  assetId?: string;
}

const OrderBook: React.FC<IOrderbookProps> = ({ assetId }) => {
  const { getOrders, getAsset } = useAPI();
  const { blockHeight } = useBlocks();
  const [openOrders, setOpenOrders] = useState<IGetOrdersResult>();
  const [assetDetails, setAssetDetails] = useState<IAsset>();

  // maps both bid and ask orders
  const RowsMemo = useMemo(() => {
    if (openOrders === undefined || assetDetails === undefined || assetDetails === undefined) {
      return;
    }

    const mappedAskOrders = openOrders?.results?.askOrders.map((order, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{NQTtoNXT(order.priceNQT, LongUnitPrecision)}</TableCell>
          <TableCell>{QNTtoNXT(new BigNumber(order.quantityQNT), assetDetails?.decimals, LongUnitPrecision)}</TableCell>
        </TableRow>
      );
    });

    const mappedBidOrders = openOrders?.results?.bidOrders.map((order, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{NQTtoNXT(order.priceNQT, LongUnitPrecision)}</TableCell>
          <TableCell>{QNTtoNXT(new BigNumber(order.quantityQNT), assetDetails?.decimals, LongUnitPrecision)}</TableCell>
        </TableRow>
      );
    });

    return { asks: mappedAskOrders, bids: mappedBidOrders };
  }, [assetDetails, openOrders]);

  // set the orders for the current asset
  useEffect(() => {
    async function fetchOrders() {
      if (getOrders === undefined || assetId === undefined || getAsset === undefined) {
        return;
      }

      setOpenOrders(await getOrders(assetId));

      const assetDetailsResult = await getAsset(assetId); // asset details are required to obtain decimals for proper QNT conversion

      setAssetDetails(assetDetailsResult?.results);
    }

    fetchOrders();
  }, [assetId, blockHeight, getAsset, getOrders]);

  const AskOrderbookMemo = useMemo(() => {
    const askOrderbookStyling: CSSProperties = {
      border: "2px solid red",
      overflowX: "hidden",
    };
    return RowsMemo?.asks ? (
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
    ) : (
      <>{"No Asks"}</>
    );
  }, [RowsMemo?.asks]);

  const BidOrderbookMemo = useMemo(() => {
    const bidOrderbookStyling: CSSProperties = {
      border: "2px solid green",
      overflowX: "hidden",
    };

    return RowsMemo?.bids ? (
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
    ) : (
      <>{"No Bids"}</>
    );
  }, [RowsMemo?.bids]);

  return (
    <>
      {AskOrderbookMemo}
      {RowsMemo?.bids === undefined && RowsMemo?.asks === undefined && <div></div>}
      {BidOrderbookMemo}
    </>
  );
};

export default memo(OrderBook);
