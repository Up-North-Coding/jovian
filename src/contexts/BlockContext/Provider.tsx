import useAPI from "hooks/useAPI";
import React, { useCallback, useEffect, useState } from "react";
import { IBlock, IGetBlockchainStatusResult, IGetBlocksResult } from "types/NXTAPI";
import { CalculateAvgBlocktime } from "utils/common/AvgBlockTime";
import { DefaultBlockFetchQty, DefaultBlockOffset } from "utils/common/constants";
import Context from "./Context";

const BlockProvider: React.FC = ({ children }) => {
  const [blockHeight, setBlockHeight] = useState<number>();
  const [recentBlocks, setRecentBlocks] = useState<Array<IBlock>>();
  const [avgBlockTime, setAvgBlockTime] = useState<number>();
  const { getBlockchainStatus, getBlocks } = useAPI();

  const fetchBlockHeight = useCallback(async () => {
    if (getBlockchainStatus === undefined) {
      console.log("returning early, oops");
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

      const result: false | IGetBlocksResult = await getBlocks(first, last);

      if (result) {
        setRecentBlocks(result.blocks);
      }
    },
    [getBlocks]
  );

  useEffect(() => {
    handleFetchRecentBlocks(DefaultBlockOffset, DefaultBlockFetchQty); // fetching is done in reverse order so index 0 is the highest block
  }, [blockHeight, handleFetchRecentBlocks]);

  useEffect(() => {
    const timerId = setInterval(() => {
      fetchBlockHeight();
    }, 5000);

    return () => clearInterval(timerId);
  }, [fetchBlockHeight]);

  useEffect(() => {
    // TODO: Tooltip explaining how many blocks are avg'd?
    if (recentBlocks) {
      const result = CalculateAvgBlocktime(recentBlocks);
      setAvgBlockTime(result);
    }
  }, [blockHeight, recentBlocks]);

  return (
    <Context.Provider
      value={{
        blockHeight,
        recentBlocks,
        avgBlockTime,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default BlockProvider;
