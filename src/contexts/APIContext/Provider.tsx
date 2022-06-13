import React, { useCallback } from "react";
import Context from "./Context";
import { IGetAccountResult, IUnsignedTransaction } from "types/NXTAPI";
import getAccount from "utils/api/getAccount";
import sendJUP from "utils/api/sendJUP";
import getAccountId from "utils/api/getAccountId";
import getBlockchainStatus from "utils/api/getBlockchainStatus";
import getBalance from "utils/api/getBalance";
import getBlockchainTransactions from "utils/api/getBlockchainTransactions";
import setAccountInfo from "utils/api/setAccountInfo";
import getBlocks from "utils/api/getBlocks";
import getAccountAssets from "utils/api/getAccountAssets";
import getAsset from "utils/api/getAsset";

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

  const handleGetBlocks = useCallback(async (firstIndex: number, lastIndex: number) => {
    let blocks;

    try {
      blocks = await getBlocks(firstIndex, lastIndex);
    } catch (e) {
      console.error("error getting account in APIProvider", e);
      return false;
    }
    return blocks;
  }, []);

  const handleGetAccountAssets = useCallback(async (account: string) => {
    let assets;

    try {
      assets = await getAccountAssets(account);
    } catch (e) {
      console.error("error getting account assets in APIProvider", e);
      return false;
    }
    return assets;
  }, []);

  const handleGetAasset = useCallback(async (assetId: string) => {
    let asset;

    try {
      asset = await getAsset(assetId);
    } catch (e) {
      console.error("error getting asset in APIProvider", e);
      return false;
    }
    return asset;
  }, []);

  return (
    <Context.Provider
      value={{
        getBlockchainStatus,
        getAccount: handleGetAccount,
        setAccountInfo,
        getAccountId,
        getBalance,
        sendJUP: handleSendJUP,
        getMyTxs: handleGetBlockchainTransactions,
        getBlocks: handleGetBlocks,
        getAccountAssets: handleGetAccountAssets,
        getAsset: handleGetAasset,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default APIProvider;
