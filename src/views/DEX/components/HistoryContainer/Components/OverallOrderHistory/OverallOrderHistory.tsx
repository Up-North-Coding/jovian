import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import useAPI from "hooks/useAPI";
import { IGetTradesResult, ITrade } from "types/NXTAPI";
import useBlocks from "hooks/useBlocks";
import { orderTableColumns } from "../../../../DEX";
import { LongUnitPrecision } from "utils/common/constants";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import { TimestampToDate } from "utils/common/Formatters";
import { QtyPriceToTotal } from "utils/common/QtyPriceToTotal";
import { BigNumber } from "bignumber.js";

interface IOverallOrderHistoryProps {
  assetId?: string;
}
const OverallOrderHistory: React.FC<IOverallOrderHistoryProps> = ({ assetId }) => {
  const [tradeHistory, setTradeHistory] = useState<IGetTradesResult>();
  const { getTrades } = useAPI();
  const { blockHeight } = useBlocks();

  const fetchTrades = useCallback(async () => {
    if (getTrades === undefined || assetId === undefined) {
      return;
    }

    setTradeHistory(await getTrades(assetId));
  }, [assetId, getTrades]);

  // set the trade history for the current asset
  useEffect(() => {
    fetchTrades();
  }, [assetId, blockHeight, getTrades, fetchTrades]);

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
    return tradeHistory?.results?.trades.map((trade: ITrade) => {
      return (
        <TableRow key={`tr-${trade.timestamp}-${trade.height}-${trade.askOrder}-${trade.bidOrder}`}>
          <TableCell>{TimestampToDate(trade.timestamp)}</TableCell>
          <TableCell>{trade.tradeType}</TableCell>
          <TableCell>{trade.quantityQNT}</TableCell>
          <TableCell>{NQTtoNXT(new BigNumber(trade.priceNQT), LongUnitPrecision)}</TableCell>
          <TableCell>{QtyPriceToTotal(trade.quantityQNT, trade.priceNQT)}</TableCell>
          <TableCell>{trade.buyerRS}</TableCell>
          <TableCell>{trade.sellerRS}</TableCell>
        </TableRow>
      );
    });
  }, [tradeHistory]);

  return (
    <Table sx={{ border: "1px solid white" }}>
      <TableHead>{HeadCellsMemo}</TableHead>
      <TableBody>{RowDataMemo}</TableBody>
    </Table>
  );
};

export default memo(OverallOrderHistory);
