import useAPI from "hooks/useAPI";
import React, { useCallback, useEffect, useState } from "react";
import { IBlock, IGetBlockchainStatusResult, IGetBlocksResult } from "types/NXTAPI";
import Context from "./Context";

const BlockProvider: React.FC = ({ children }) => {
  const [blockHeight, setBlockHeight] = useState<number>();
  const [recentBlocks, setRecentBlocks] = useState<Array<IBlock>>();
  const { getBlockchainStatus, getBlocks } = useAPI();

  const fetchBlockHeight = useCallback(async () => {
    if (getBlockchainStatus === undefined) {
      console.log("returning early, oops");
      return;
    }

    const result: false | IGetBlockchainStatusResult = await getBlockchainStatus();
    if (result) {
      setBlockHeight(result.numberOfBlocks);
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
    handleFetchRecentBlocks(0, 10);
  }, [blockHeight, handleFetchRecentBlocks]);

  useEffect(() => {
    const timerId = setInterval(() => {
      fetchBlockHeight();
    }, 5000);

    return () => clearInterval(timerId);
  }, [fetchBlockHeight]);

  return (
    <Context.Provider
      value={{
        blockHeight,
        recentBlocks,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default BlockProvider;
