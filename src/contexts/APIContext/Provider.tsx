import React, { useCallback } from "react";
import Context from "./Context";
import getAccount from "utils/api/getAccount";
import sendJUP from "utils/api/sendJUP";
import getAccountId from "utils/api/getAccountId";
import getBlockchainStatus from "utils/api/getBlockchainStatus";
import getBalance from "utils/api/getBalance";
import { IGetAccountResult, IUnsignedTransaction } from "types/NXTAPI";
import getBlockchainTransactions from "utils/api/getBlockchainTransactions";

const APIProvider: React.FC = ({ children }) => {
  const handleGetAccount = useCallback(async (address: string) => {
    let account: IGetAccountResult;

    try {
      account = await getAccount(address);
    } catch (e) {
      console.error("error getting account in APIProvider", e);
      return false;
    }
    return account;
  }, []);

  const handleSendJUP = useCallback(async (unsignedTxJSON: IUnsignedTransaction) => {
    return sendJUP(unsignedTxJSON); // return the result back to the caller so they can work with the whole signed object/error for now
  }, []);

  const handleGetBlockchainTransactions = useCallback(async (account: string) => {
    let transactions;
    try {
      transactions = await getBlockchainTransactions(account);
    } catch (e) {
      console.error("error getting transactions in API provider");
      return false;
    }

    return transactions;
  }, []);

  return (
    <Context.Provider
      value={{
        getBlockchainStatus,
        getAccount: handleGetAccount,
        getAccountId,
        getBalance,
        sendJUP: handleSendJUP,
        getMyTxs: handleGetBlockchainTransactions,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default APIProvider;
