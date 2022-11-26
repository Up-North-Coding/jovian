import React, { useCallback, useEffect, useState } from "react";
import { IBlock, IGetBlockchainStatusResult, IGetBlockResult } from "types/NXTAPI";
import { CalculateAvgBlocktime } from "utils/common/blockchainMetrics/AvgBlockTime";
import { BlockPollingFrequency, DefaultBlockFetchQty, DefaultBlockOffset, ShortUnitPrecision } from "utils/common/constants";
import { TxCount } from "utils/common/blockchainMetrics/DailyTransactionCount";
import { CalculateDailyFees } from "utils/common/blockchainMetrics/DailyFees";
import { FetchLatestBlocktime } from "utils/common/blockchainMetrics/LatestBlocktime";
import { CalculateAvgTxValue } from "utils/common/blockchainMetrics/AvgTxValue";
import getBlocks from "utils/api/getBlocks";
import getBlock from "utils/api/getBlock";
import getBlockchainStatus from "utils/api/getBlockchainStatus";
import Context from "./Context";
import { useSnackbar } from "notistack";
import { messageText } from "utils/common/messages";

const BlockProvider: React.FC = ({ children }) => {
  const [blockHeight, setBlockHeight] = useState<number>();
  const [recentBlocks, setRecentBlocks] = useState<Array<IBlock>>();
  const [avgBlockTime, setAvgBlockTime] = useState<string>();
  const [dailyTxs, setDailyTxs] = useState<string>();
  const [dailyFees, setDailyFees] = useState<string>();
  const [avgTxValue, setAvgTxValue] = useState<string>();
  const [latestBlocktime, setLatestBlocktime] = useState<string>();

  const { enqueueSnackbar } = useSnackbar();

  const fetchBlockHeight = useCallback(async () => {
    const chainStatus = await getBlockchainStatus();
    if (chainStatus?.error || chainStatus?.results?.numberOfBlocks === undefined) {
      enqueueSnackbar(messageText.errors.api.replace("{api}", "getBlockchainStatus"), { variant: "error" });
      return;
    }

    setBlockHeight(chainStatus.results.numberOfBlocks - 1); // blocks are index'd at 0 so current height is number of blocks minus one
  }, [enqueueSnackbar]);

  const handleFetchRecentBlocks = useCallback(
    async (first: number, last: number) => {
      const blocks = await getBlocks(first, last, true);

      if (blocks?.error) {
        enqueueSnackbar(messageText.errors.api.replace("{api}", "getBlocks"), { variant: "error" });
        return;
      }

      if (blocks?.results) {
        setRecentBlocks(blocks.results.blocks);
      }
    },
    [enqueueSnackbar]
  );

  const handleGetBlockchainStatus = useCallback(async (): Promise<IGetBlockchainStatusResult | undefined> => {
    const chainStatus = await getBlockchainStatus();
    if (chainStatus?.error || chainStatus?.results === undefined) {
      enqueueSnackbar(messageText.errors.api.replace("{api}", "getBlockchainStatus"), { variant: "error" });
      return;
    }

    return chainStatus;
  }, [enqueueSnackbar]);

  const handleFetchBlockDetails = useCallback(
    async (height: number): Promise<IGetBlockResult | undefined> => {
      const block = await getBlock(height, true);
      if (block?.error || block?.results === undefined) {
        enqueueSnackbar(messageText.errors.api.replace("{api}", "getBlock"), { variant: "error" });
        return;
      }

      return block;
    },
    [enqueueSnackbar]
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

  // Sets various metrics on each block update
  useEffect(() => {
    if (recentBlocks) {
      setAvgBlockTime(CalculateAvgBlocktime(recentBlocks)?.toFixed(ShortUnitPrecision));
      setDailyTxs(TxCount(recentBlocks)?.toString());
      setDailyFees(CalculateDailyFees(recentBlocks).toFixed(ShortUnitPrecision + 1));
      setAvgTxValue(CalculateAvgTxValue(recentBlocks)?.toFixed(ShortUnitPrecision + 1));
      setLatestBlocktime(FetchLatestBlocktime(recentBlocks));
    }
  }, [blockHeight, recentBlocks]);

  return (
    <Context.Provider
      value={{
        blockHeight,
        recentBlocks,
        getBlockDetails: handleFetchBlockDetails,
        getBlockchainStatus: handleGetBlockchainStatus,
        avgBlockTime,
        dailyTxs,
        dailyFees,
        avgTxValue,
        latestBlocktime,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default BlockProvider;
