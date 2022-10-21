import React, { useCallback, useEffect, useState } from "react";
import { IBlock, IGetBlockchainStatusResult, IGetBlocksResult } from "types/NXTAPI";
import { CalculateAvgBlocktime } from "utils/common/blockchainMetrics/AvgBlockTime";
import { BlockPollingFrequency, DefaultBlockFetchQty, DefaultBlockOffset, ShortUnitPrecision } from "utils/common/constants";
import { TxCount } from "utils/common/blockchainMetrics/DailyTransactionCount";
import { CalculateDailyFees } from "utils/common/blockchainMetrics/DailyFees";
import { CalculateAvgTxValue } from "utils/common/blockchainMetrics/AvgTxValue";
import useAPI from "hooks/useAPI";
import Context from "./Context";

const BlockProvider: React.FC = ({ children }) => {
  const [blockHeight, setBlockHeight] = useState<number>();
  const [recentBlocks, setRecentBlocks] = useState<Array<IBlock>>();
  const [avgBlockTime, setAvgBlockTime] = useState<string>();
  const [dailyTxs, setDailyTxs] = useState<string>();
  const [dailyFees, setDailyFees] = useState<string>();
  const [avgTxValue, setAvgTxValue] = useState<string>();

  const { getBlockchainStatus, getBlocks, getBlock } = useAPI();

  const fetchBlockHeight = useCallback(async () => {
    if (getBlockchainStatus === undefined) {
      return;
    }

    const result: false | IGetBlockchainStatusResult = await getBlockchainStatus();
    if (result) {
      setBlockHeight(result.numberOfBlocks - 1); // blocks are index'd at 0 so current height is number of blocks minus one
    }
  }, [getBlockchainStatus]);

  const handleFetchRecentBlocks = useCallback(
    async (first: number, last: number) => {
      if (getBlocks === undefined) {
        return;
      }

      const result: false | IGetBlocksResult = await getBlocks(first, last, true);

      if (result) {
        setRecentBlocks(result.blocks);
      }
    },
    [getBlocks]
  );

  const handleFetchBlockDetails = useCallback(
    async (height: number) => {
      if (getBlock === undefined) {
        return false;
      }

      const result: false | IBlock = await getBlock(height, true);

      return result;
    },
    [getBlock]
  );

  useEffect(() => {
    handleFetchRecentBlocks(DefaultBlockOffset, DefaultBlockFetchQty); // fetching is done in reverse order so index 0 is the highest block
  }, [blockHeight, handleFetchRecentBlocks]);

  // fetches blocks based on BlockPollingFrequency
  useEffect(() => {
    const timerId = setInterval(() => {
      fetchBlockHeight();
    }, BlockPollingFrequency);

    return () => clearInterval(timerId);
  }, [fetchBlockHeight]);

  // Averages blocktimes across a set of blocks
  useEffect(() => {
    // TODO: Tooltip explaining how many blocks are avg'd?
    if (recentBlocks) {
      setAvgBlockTime(CalculateAvgBlocktime(recentBlocks)?.toFixed(ShortUnitPrecision));
      setDailyTxs(TxCount(recentBlocks)?.toString());
      setDailyFees(CalculateDailyFees(recentBlocks).toFixed(ShortUnitPrecision + 1));
      setAvgTxValue(CalculateAvgTxValue(recentBlocks)?.toFixed(ShortUnitPrecision + 1));
    }
  }, [blockHeight, recentBlocks]);

  return (
    <Context.Provider
      value={{
        blockHeight,
        recentBlocks,
        getBlockDetails: handleFetchBlockDetails,
        avgBlockTime,
        dailyTxs,
        dailyFees,
        avgTxValue,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default BlockProvider;
