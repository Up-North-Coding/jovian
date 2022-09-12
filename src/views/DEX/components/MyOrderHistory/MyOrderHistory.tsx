import React, { memo, useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import useAPI from "hooks/useAPI";
import { IGetTradesResult, ITrade } from "types/NXTAPI";
import useBlocks from "hooks/useBlocks";
import { orderTableColumns } from "../../DEX";
import useAccount from "hooks/useAccount";
import { LongUnitPrecision } from "utils/common/constants";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import { BigNumber } from "bignumber.js";

interface IOverallOrderHistoryProps {
  assetId?: string;
}

const MyOrderHistory: React.FC<IOverallOrderHistoryProps> = ({ assetId }) => {
  const [swapHistory, setMySwapHistory] = useState<IGetTradesResult>();
  const { getTrades } = useAPI();
  const { blockHeight } = useBlocks();
  const { accountRs } = useAccount();

  // set the current account's swap history for the current asset
  useEffect(() => {
    async function fetchTrades() {
      if (assetId === undefined) {
        throw new Error("assetId property not supplied to MyOrderHistory, please fix.");
      }
      if (getTrades === undefined) {
        return;
      }

      try {
        const result = await getTrades(assetId, accountRs);
        console.log("our swaps:", result);

        if (result) {
          setMySwapHistory(result);
        }
      } catch (e) {
        console.error("error while getting account swap history:", e);
        return;
      }
    }
    fetchTrades();
  }, [accountRs, assetId, blockHeight, getTrades]);

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
    return swapHistory?.trades.map((trade: ITrade) => {
      return (
        <TableRow key={`tr-${trade.timestamp}-${trade.height}-${trade.askOrder}-${trade.bidOrder}`}>
          <TableCell>{trade.timestamp}</TableCell>
          <TableCell>{trade.tradeType}</TableCell>
          <TableCell>{trade.quantityQNT}</TableCell>
          <TableCell>{NQTtoNXT(new BigNumber(trade.priceNQT)).toFixed(LongUnitPrecision)}</TableCell>
          <TableCell>{"total"}</TableCell>
          <TableCell>{trade.buyerRS}</TableCell>
          <TableCell>{trade.sellerRS}</TableCell>
        </TableRow>
      );
    });
  }, [swapHistory]);

  return (
    <Table sx={{ border: "1px solid white" }}>
      <TableHead>{HeadCellsMemo}</TableHead>
      <TableBody>{RowDataMemo}</TableBody>
    </Table>
  );
};

export default memo(MyOrderHistory);
