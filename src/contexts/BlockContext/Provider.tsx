import useAPI from "hooks/useAPI";
import React, { useCallback, useEffect, useState } from "react";
import { IGetBlockchainStatusResult } from "types/NXTAPI";
import Context from "./Context";

const BlockProvider: React.FC = ({ children }) => {
  const [blockHeight, setBlockHeight] = useState<number>();
  const { getBlockchainStatus } = useAPI();
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

  useEffect(() => {
    setInterval(() => {
      fetchBlockHeight();
    }, 5000);
  }, [fetchBlockHeight]);

  return (
    <Context.Provider
      value={{
        blockHeight,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default BlockProvider;
