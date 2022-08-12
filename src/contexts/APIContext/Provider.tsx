import React, { useCallback } from "react";
import Context from "./Context";
import { IGetAccountResult, IOpenOrder } from "types/NXTAPI";
import getAccount from "utils/api/getAccount";
import getAccountId from "utils/api/getAccountId";
import getBlockchainStatus from "utils/api/getBlockchainStatus";
import getBalance from "utils/api/getBalance";
import getBlockchainTransactions from "utils/api/getBlockchainTransactions";
import setAccountInfo from "utils/api/setAccountInfo";
import getBlocks from "utils/api/getBlocks";
import getAccountAssets from "utils/api/getAccountAssets";
import getAsset from "utils/api/getAsset";
import searchAssets from "utils/api/searchAssets";
import { getBidOrders, getAskOrders } from "utils/api/getOrders";
import getBlock from "utils/api/getBlock";

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

  const handleGetBlocks = useCallback(async (firstIndex: number, lastIndex: number, includeTransactions: boolean) => {
    let blocks;

    try {
      blocks = await getBlocks(firstIndex, lastIndex, includeTransactions);
    } catch (e) {
      console.error("error getting blocks in APIProvider", e);
      return false;
    }
    return blocks;
  }, []);

  const handleGetBlock = useCallback(async (height: number, includeTransactions: boolean) => {
    let block;

    try {
      block = await getBlock(height, includeTransactions);
    } catch (e) {
      console.error("error getting block details in APIProvider", e);
      return false;
    }
    return block;
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

  const handleGetOrders = useCallback(async (assetId: number) => {
    let bids: Array<IOpenOrder>;
    let asks: Array<IOpenOrder>;

    try {
      bids = await getBidOrders(assetId);
    } catch (e) {
      console.error("error getting bid orders in APIProvider", e);
      return false;
    }

    try {
      asks = await getAskOrders(assetId);
    } catch (e) {
      console.error("error getting ask orders in APIProvider", e);
      return false;
    }
    return { bids, asks };
  }, []);

  const handleSearchAssets = useCallback(async (queryString: string) => {
    let searchResult;

    try {
      searchResult = await searchAssets(queryString);
    } catch (e) {
      console.error("error searching for assets in APIProvider", e);
      return false;
    }
    return searchResult;
  }, []);

  return (
    <Context.Provider
      value={{
        getBlockchainStatus,
        getAccount: handleGetAccount,
        getAccountId,
        getBalance,
        getMyTxs: handleGetBlockchainTransactions,
        getBlocks: handleGetBlocks,
        getBlock: handleGetBlock,
        getAccountAssets: handleGetAccountAssets,
        getAsset: handleGetAasset,
        getOrders: handleGetOrders,
        searchAssets: handleSearchAssets,
        handleFetchAccountIDFromRS,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default APIProvider;
