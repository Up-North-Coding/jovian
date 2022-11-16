import React, { useCallback, useState } from "react";
import Context from "./Context";
import {
  IGenerator,
  IGetNextBlockGeneratorsResult,
  IGetAccountResult,
  IGetAssetResult,
  IGetBlockchainTransactionResult,
  IGetOrdersResult,
  IGetPeerResult,
  IGetPeersResult,
  IGetTradesResult,
  IPeerInfo,
  ISearchAssetsResult,
} from "types/NXTAPI";
import getAccount from "utils/api/getAccount";
import getAccountId from "utils/api/getAccountId";
import getBalance from "utils/api/getBalance";
import getBlockchainTransactions from "utils/api/getBlockchainTransactions";
import getAsset from "utils/api/getAsset";
import searchAssets from "utils/api/searchAssets";
import { getBidOrders, getAskOrders } from "utils/api/getOrders"; // gets bulk bid/ask orders for a specific asset
import getPeers from "utils/api/getPeers";
import getPeer from "utils/api/getPeer";
import getTrades from "utils/api/getTrades";
import getNextBlockGenerators from "utils/api/getNextBlockGenerators";
import { messageText } from "utils/common/messages";
import { useSnackbar } from "notistack";

const APIProvider: React.FC = ({ children }) => {
  const [peers, setPeers] = useState<Array<string>>();
  const [peerDetails, setPeerDetails] = useState<Array<IPeerInfo>>();
  const [generators, setGenerators] = useState<Array<IGenerator>>();

  const { enqueueSnackbar } = useSnackbar();

  const handleFetchAccountIDFromRS = useCallback(
    async (address: string): Promise<string | undefined> => {
      if (getAccount === undefined || getAccountId === undefined) {
        return;
      }

      const acct = await getAccount(address);
      if (acct.error || acct?.results?.publicKey === undefined) {
        enqueueSnackbar(messageText.errors.api.replace("{api}", "getAccount"), { variant: "error" });
        return;
      }

      const accountId = await getAccountId(acct.results.publicKey);
      if (accountId.error || accountId?.results?.account === undefined) {
        enqueueSnackbar(messageText.errors.api.replace("{api}", "getAccountId"), { variant: "error" });
        return;
      }

      return accountId.results.account;
    },
    [enqueueSnackbar]
  );

  const handleGetAccount = useCallback(
    async (address: string): Promise<undefined | IGetAccountResult> => {
      const account = await getAccount(address);

      if (account.error || account?.results === undefined) {
        enqueueSnackbar(messageText.errors.api.replace("{api}", "getAccount"), { variant: "error" });
        return;
      }

      return account;
    },
    [enqueueSnackbar]
  );

  const handleGetBlockchainTransactions = useCallback(
    async (account: string): Promise<undefined | IGetBlockchainTransactionResult> => {
      const transactions = await getBlockchainTransactions(account);

      if (transactions.error || transactions?.results === undefined) {
        enqueueSnackbar(messageText.errors.api.replace("{api}", "getBlockchainTransactions"), { variant: "error" });
        return;
      }

      return transactions;
    },
    [enqueueSnackbar]
  );

  const handleGetAsset = useCallback(
    async (assetId: string): Promise<undefined | IGetAssetResult> => {
      const asset = await getAsset(assetId);

      if (asset.error) {
        enqueueSnackbar(messageText.errors.api.replace("{api}", "getAsset"), { variant: "error" });
        return;
      }

      return asset;
    },
    [enqueueSnackbar]
  );

  const handleGetOrders = useCallback(
    async (assetId: string): Promise<undefined | IGetOrdersResult> => {
      const bids = await getBidOrders(assetId);
      const asks = await getAskOrders(assetId);

      if (bids?.results?.bidOrders === undefined || asks?.results?.askOrders === undefined || bids.error || asks.error) {
        enqueueSnackbar(messageText.errors.api.replace("{api}", "getOrders"), { variant: "error" });
        return;
      }

      return {
        results: {
          bidOrders: bids.results.bidOrders,
          askOrders: asks.results.askOrders,
          requestProcessingTime: bids.results.requestProcessingTime + asks.results.requestProcessingTime,
        },
      };
    },
    [enqueueSnackbar]
  );

  const handleGetPeer = useCallback(
    async (peerAddress: string): Promise<undefined | IGetPeerResult> => {
      const peerResult = await getPeer(peerAddress);

      if (peerResult.error || peerResult.results === undefined) {
        enqueueSnackbar(messageText.errors.api.replace("{api}", "getPeer"), { variant: "error" });
        return;
      }

      return peerResult;
    },
    [enqueueSnackbar]
  );

  const handleGetPeers = useCallback(async (): Promise<undefined | IGetPeersResult> => {
    const peers = await getPeers();

    if (peers.error || peers?.results?.peers === undefined) {
      enqueueSnackbar(messageText.errors.api.replace("{api}", "getPeers"), { variant: "error" });
      return;
    }

    // loop (with map) through each peer and perform an async getPeer() lookup on each, await all of these results
    const peerDetailArray = await Promise.all(
      peers.results.peers.map(async (peer) => {
        const peerDetail = await getPeer(peer);

        return peerDetail?.results as IPeerInfo;
      })
    );

    if (peerDetailArray === undefined) {
      console.error("no peer details fetched");
      enqueueSnackbar(messageText.errors.api.replace("{api}", "getPeerDetail[]"), { variant: "error" });
      return;
    }

    setPeers(peers?.results?.peers);
    setPeerDetails(peerDetailArray);
    return peers;
  }, [enqueueSnackbar]);

  const handleGetTrades = useCallback(
    async (queryString: string): Promise<undefined | IGetTradesResult> => {
      const trades = await getTrades(queryString);

      if (trades.error) {
        enqueueSnackbar(messageText.errors.api.replace("{api}", "getTrades"), { variant: "error" });
        return;
      }

      return trades;
    },
    [enqueueSnackbar]
  );

  const handleSearchAssets = useCallback(
    async (queryString: string): Promise<undefined | ISearchAssetsResult> => {
      const assets = await searchAssets(queryString);

      if (assets.error) {
        enqueueSnackbar(messageText.errors.api.replace("{api}", "searchAssets"), { variant: "error" });
        return;
      }

      return assets;
    },
    [enqueueSnackbar]
  );

  const handleGetGenerators = useCallback(async () => {
    let generatorsResult: IGetNextBlockGeneratorsResult | false;

    try {
      generatorsResult = await getNextBlockGenerators();
    } catch (e) {
      console.error("error getting generators:", e);
      return false;
    }

    if (generatorsResult) {
      setGenerators(generatorsResult.generators);
    }
    return generatorsResult;
  }, []);

  return (
    <Context.Provider
      value={{
        getAccount: handleGetAccount,
        getAccountId,
        getBalance,
        getMyTxs: handleGetBlockchainTransactions,
        getAsset: handleGetAsset,
        getOrders: handleGetOrders,
        getPeer: handleGetPeer,
        getPeers: handleGetPeers,
        getTrades: handleGetTrades,
        searchAssets: handleSearchAssets,
        handleFetchAccountIDFromRS,
        getGenerators: handleGetGenerators,
        peers,
        peerDetails,
        generators,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default APIProvider;
