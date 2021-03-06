import React, { useCallback, useEffect, useState } from "react";
import Context from "./Context";
import useAccount from "hooks/useAccount";
import useAPI from "hooks/useAPI";
import useBlocks from "hooks/useBlocks";

const MyTxProvider: React.FC = ({ children }) => {
  const [myTxs, setMyTxs] = useState<any>();
  const { getMyTxs } = useAPI();
  const { accountRs } = useAccount();
  const { blockHeight } = useBlocks();

  const handleFetchTransactions = useCallback(async () => {
    if (getMyTxs === undefined || accountRs === undefined) {
      return;
    }

    const tx = await getMyTxs(accountRs);
    setMyTxs(tx);
  }, [accountRs, getMyTxs]);

  useEffect(() => {
    handleFetchTransactions();
  }, [blockHeight, handleFetchTransactions]);

  return (
    <Context.Provider
      value={{
        transactions: myTxs,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default MyTxProvider;
