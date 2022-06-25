import React, { useCallback } from "react";
import Context from "./Context";
import { IGetAccountResult, IUnsignedTransaction } from "types/NXTAPI";
import getAccount from "utils/api/getAccount";
import getAccountId from "utils/api/getAccountId";
import getBlockchainStatus from "utils/api/getBlockchainStatus";
import getBalance from "utils/api/getBalance";
import getBlockchainTransactions from "utils/api/getBlockchainTransactions";
import setAccountInfo from "utils/api/setAccountInfo";
import getBlocks from "utils/api/getBlocks";

const APIProvider: React.FC = ({ children }) => {
  const handleFetchAccountIDFromRS = useCallback(async (address: string): Promise<string | undefined> => {
    if (getAccount === undefined || getAccountId === undefined) {
      return;
    }

    try {
      const result = await getAccount(address);
      if (result) {
        const accountResult = await getAccountId(result.publicKey);
        if (accountResult) {
          return accountResult.account;
        }
      }
    } catch (e) {
      console.error("error while fetching public key:", e);
      return;
    }
  }, []);

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

  const handleGetBlocks = useCallback(async (firstIndex: number, lastIndex: number) => {
    let blocks;

    try {
      blocks = await getBlocks(firstIndex, lastIndex);
    } catch (e) {
      console.error("error getting blocks in APIProvider", e);
      return false;
    }
    return blocks;
  }, []);

  return (
    <Context.Provider
      value={{
        getBlockchainStatus,
        getAccount: handleGetAccount,
        setAccountInfo,
        getAccountId,
        getBalance,
        getMyTxs: handleGetBlockchainTransactions,
        getBlocks: handleGetBlocks,
        handleFetchAccountIDFromRS,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default APIProvider;
