import React, { useCallback, useEffect, useState } from "react";
import Context from "./Context";
import { ITransaction } from "types/NXTAPI";
import useAccount from "hooks/useAccount";
import useAPI from "hooks/useAPI";
import useBlocks from "hooks/useBlocks";
import { useSnackbar } from "notistack";
import { messageText } from "../../utils/common/messages";

const MyTxProvider: React.FC = ({ children }) => {
  const [myTxs, setMyTxs] = useState<Array<ITransaction>>();
  const { getMyTxs } = useAPI();
  const { accountRs } = useAccount();
  const { blockHeight } = useBlocks();
  const { enqueueSnackbar } = useSnackbar();

  const handleFetchTransactions = useCallback(async () => {
    if (getMyTxs === undefined || accountRs === undefined) {
      return;
    }
    const tx = await getMyTxs(accountRs);

    if (tx?.error || tx?.results?.transactions === undefined) {
      enqueueSnackbar(messageText.errors.api.replace("{api}", "getMyTxs"), { variant: "error" });
      return;
    }

    setMyTxs(tx.results.transactions);
  }, [accountRs, enqueueSnackbar, getMyTxs]);

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
