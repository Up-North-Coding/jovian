import React, { useCallback, useState } from "react";
import Context from "./Context";
import { IGetAccountResult, IGetPeerResult, IGetPeersResult, IOpenOrder, IPeerInfo } from "types/NXTAPI";
import getAccount from "utils/api/getAccount";
import getAccountId from "utils/api/getAccountId";
import getBlockchainStatus from "utils/api/getBlockchainStatus";
import getBalance from "utils/api/getBalance";
import getBlockchainTransactions from "utils/api/getBlockchainTransactions";
import getBlocks from "utils/api/getBlocks";
import getAccountAssets from "utils/api/getAccountAssets";
import getAsset from "utils/api/getAsset";
import searchAssets from "utils/api/searchAssets";
import { getBidOrders, getAskOrders } from "utils/api/getOrders"; // gets bulk bid/ask orders for a specific asset
import getBlock from "utils/api/getBlock";
import getPeers from "utils/api/getPeers";
import getPeer from "utils/api/getPeer";
import getTrades from "utils/api/getTrades";
import { getAccountCurrentAskOrders, getAccountCurrentBidOrders } from "utils/api/getAccountCurrentOrders"; // gets bid/ask orders for a specific account

const APIProvider: React.FC = ({ children }) => {
  const [peers, setPeers] = useState<Array<string>>();
  const [peerDetails, setPeerDetails] = useState<Array<IPeerInfo>>();

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

  const handleGetAsset = useCallback(async (assetId: string) => {
    let asset;

    try {
      asset = await getAsset(assetId);
    } catch (e) {
      console.error("error getting asset in APIProvider", e);
      return false;
    }
    return asset;
  }, []);

  const handleGetOrders = useCallback(async (assetId: string) => {
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

  const handleGetPeer = useCallback(async (peerAddress: string) => {
    let peerResult: IGetPeerResult;

    try {
      peerResult = await getPeer(peerAddress);
    } catch (e) {
      console.error("error getting individual peer:", e);
      return false;
    }

    return peerResult;
  }, []);

  const handleGetPeers = useCallback(async () => {
    let peers: IGetPeersResult | false;

    try {
      peers = await getPeers();
    } catch (e) {
      console.error("error getting peers in APIProvider", e);
      return false;
    }
    if (!peers) {
      console.error("no peers found!");
      return false;
    }
    setPeers(peers.peers);

    // loop (with map) through each peer and perform an async getPeer() lookup on each, await all of these results
    const peerDetailArray: Array<IPeerInfo> = await Promise.all(
      peers.peers.map(async (peer) => {
        let peerDetail;

        try {
          peerDetail = getPeer(peer);
        } catch (e) {
          console.error("error getting individual peer:", e);
        }

        return peerDetail;
      })
    );

    if (peerDetailArray === undefined) {
      console.error("no peer details fetched");
      return false;
    }

    setPeerDetails(peerDetailArray);
    return peers;
  }, []);

  const handleGetTrades = useCallback(async (queryString: string) => {
    let getTradesResult;

    try {
      getTradesResult = await getTrades(queryString);
      if (getTradesResult) {
        return getTradesResult;
      }
    } catch (e) {
      console.error("error getting trades APIProvider", e);
      return false;
    }
  }, []);

  const handleGetAccountCurrentOrders = useCallback(async (assetId: string, account: string) => {
    let bidOrders: Array<IOpenOrder>;
    let askOrders: Array<IOpenOrder>;

    try {
      bidOrders = await getAccountCurrentBidOrders(assetId, account);
    } catch (e) {
      console.error("error getting current account bid orders in APIProvider", e);
      return false;
    }

    try {
      askOrders = await getAccountCurrentAskOrders(assetId, account);
    } catch (e) {
      console.error("error getting current account ask orders in APIProvider", e);
      return false;
    }
    return { bidOrders, askOrders };
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
        getAsset: handleGetAsset,
        getOrders: handleGetOrders,
        getPeer: handleGetPeer,
        getPeers: handleGetPeers,
        getTrades: handleGetTrades,
        getAccountCurrentOrders: handleGetAccountCurrentOrders,
        searchAssets: handleSearchAssets,
        handleFetchAccountIDFromRS,
        peers,
        peerDetails,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default APIProvider;
