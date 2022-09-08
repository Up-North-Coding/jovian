import React, { useCallback, useEffect, useState } from "react";
import { IBlock, IGetBlockchainStatusResult, IGetBlocksResult } from "types/NXTAPI";
import { CalculateAvgBlocktime } from "utils/common/AvgBlockTime";
import { BlockPollingFrequency, DefaultBlockFetchQty, DefaultBlockOffset, PeerPollingFrequency } from "utils/common/constants";
import { TxCount } from "utils/common/DailyTransactionCount";
import useAPI from "hooks/useAPI";
import Context from "./Context";

const BlockProvider: React.FC = ({ children }) => {
  const [blockHeight, setBlockHeight] = useState<number>();
  const [recentBlocks, setRecentBlocks] = useState<Array<IBlock>>();
  const [avgBlockTime, setAvgBlockTime] = useState<number>();
  const [dailyTxs, setDailyTxs] = useState<number>();
  const [lastGetPeersBlock, setLastGetPeersBlock] = useState<number>();
  const [previouslyFetchedPeers, setPreviouslyFetchedPeers] = useState<Array<string>>();
  const { getBlockchainStatus, getBlocks, getBlock, getPeers } = useAPI();

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

      const result: false | IGetBlocksResult = await getBlocks(first, last, false);

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
      const avgBlocktimeResult = CalculateAvgBlocktime(recentBlocks);
      const dailyTx = TxCount(recentBlocks);
      setAvgBlockTime(avgBlocktimeResult);
      setDailyTxs(dailyTx);
    }
  }, [blockHeight, recentBlocks]);

  // Updates peers based on PeerPollingFrequency
  useEffect(() => {
    if (getPeers === undefined || blockHeight === undefined) {
      return;
    }

    // Only fetch based on the PeerPollingFrequency to reduce RPC calls since this isn't critical on a per-block basis
    if (lastGetPeersBlock !== undefined && isPollingFrequencyMet(PeerPollingFrequency, lastGetPeersBlock, blockHeight)) {
      return;
    }

    getPeers();
  }, [getPeers, blockHeight, lastGetPeersBlock, previouslyFetchedPeers]);

  // performed getPeer on each peer periodically
  // useEffect(()=>{
  //     // check if the peers are identical from the last time
  //     if(peers.peers === previouslyFetchedPeers){
  //       console.log("implement detailed peer fetch")
  //     }
  // }, [])

  return (
    <Context.Provider
      value={{
        blockHeight,
        recentBlocks,
        getBlockDetails: handleFetchBlockDetails,
        avgBlockTime,
        dailyTxs,
      }}
    >
      {children}
    </Context.Provider>
  );
};

// returns true if the polling frequency has been reached
// returns false if the polling frequency has not been reached
function isPollingFrequencyMet(frequency: number, lastHeight: number, currentHeight: number): boolean {
  return lastHeight + frequency !== currentHeight;
}

export default BlockProvider;
