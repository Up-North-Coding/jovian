import React, { useCallback, useEffect, useState } from "react";
import { generateNewWallet } from "utils/wallet";
import Context from "./Context";
import useAPI from "hooks/useAPI";
import useAuth from "hooks/useAuth";
import useBlocks from "hooks/useBlocks";
import { getAccountCurrentAskOrders, getAccountCurrentBidOrders } from "../../utils/api/getAccountCurrentOrders";
import { IGetAccountCurrentOrdersResult } from "../../types/NXTAPI";
import { messageText } from "../../utils/common/messages";
import { useSnackbar } from "notistack";

const AccountProvider: React.FC = ({ children }) => {
  const [accountRs, setAccountRs] = useState<string>();
  const [accountSeed, setAccountSeed] = useState<string>();
  const [accountName, setAccountName] = useState<string>();
  const [accountDescription, setAccountDescription] = useState<string>();
  const [accountId, setAccountId] = useState<string>();
  const [publicKey, setPublicKey] = useState<string>();
  const [balance, setBalance] = useState<string>();
  const { getAccount, getBalance } = useAPI();
  const { signIn } = useAuth();
  const { blockHeight } = useBlocks();
  const { enqueueSnackbar } = useSnackbar();

  // Creates a new seed, deduplicates words, converts to accountRs format, sets it in state
  const fetchNewAccount = useCallback(async () => {
    let result = await generateNewWallet();

    if (result.accountSeed === undefined) {
      return;
    }

    // continues regenerating new seed phrases until there are no duplicated words
    while (!noDuplicateSeedwords(result.accountSeed)) {
      result = await generateNewWallet();
    }

    setAccountRs(result.accountRs);
    setAccountSeed(result.accountSeed);
  }, []);

  const handleLogin = useCallback(
    (account: string) => {
      setAccountRs(account);
      if (signIn === undefined) {
        return;
      }
      signIn(account);
    },
    [signIn]
  );

  const handleLogout = useCallback(() => {
    setAccountRs(undefined);
  }, []);

  // Flushes seed back to empty string after we're done using it
  const flushAccountSeed = useCallback(() => {
    setAccountSeed("");
  }, []);

  const handleGetAccountCurrentOrders = useCallback(
    async (assetId: string, account: string): Promise<undefined | IGetAccountCurrentOrdersResult> => {
      const bidOrders = await getAccountCurrentBidOrders(assetId, account);
      const askOrders = await getAccountCurrentAskOrders(assetId, account);

      if (bidOrders?.results?.bidOrders === undefined || askOrders?.results?.askOrders === undefined || bidOrders.error || askOrders.error) {
        enqueueSnackbar(messageText.errors.api.replace("{api}", "getAccountCurrentOrders"), { variant: "error" });
        return;
      }

      return {
        results: {
          bidOrders: bidOrders.results.bidOrders,
          askOrders: askOrders.results.askOrders,
          requestProcessingTime: bidOrders.results.requestProcessingTime + askOrders.results.requestProcessingTime,
        },
      };
    },
    [enqueueSnackbar]
  );

  const fetchAccount = useCallback(async (): Promise<undefined> => {
    if (accountRs === undefined || getAccount === undefined || getBalance === undefined) {
      return;
    }

    const accountResult = await getAccount(accountRs);
    const balanceResult = await getBalance(accountRs);
    if (accountResult?.error || balanceResult?.error || accountResult?.results === undefined) {
      enqueueSnackbar(messageText.errors.api.replace("{api}", "fetchAccount()"), { variant: "error" });
      return;
    }
    setAccountName(accountResult?.results?.name || "Set Name"); // defaults to "Set Name" if user hasn't set one
    setAccountDescription(accountResult?.results?.description || "Set Description"); // defaults to "Set Name" if user hasn't set one
    setAccountId(accountResult?.results?.account || "unknown");
    setBalance(balanceResult?.results?.unconfirmedBalanceNQT || "unknown");
    setPublicKey(accountResult.results.publicKey);
  }, [accountRs, enqueueSnackbar, getAccount, getBalance]);

  // once accountRs is set, useEffect sets the accountName into context and gets JUP balance
  useEffect(() => {
    fetchAccount();
  }, [accountRs, getAccount, getBalance, blockHeight, fetchAccount]);

  return (
    <Context.Provider
      value={{
        accountId,
        accountRs,
        accountSeed,
        accountName,
        accountDescription,
        publicKey,
        balance,
        fetchFn: fetchNewAccount,
        flushFn: flushAccountSeed,
        userLogin: handleLogin,
        userLogout: handleLogout,
        getAccountCurrentOrders: handleGetAccountCurrentOrders,
      }}
    >
      {children}
    </Context.Provider>
  );
};

//
// Helper functions
//

function noDuplicateSeedwords(seed: string | undefined) {
  if (seed === undefined) {
    return false;
  }
  const seedArray = seed.split(" ");
  let counter = 0;
  for (const seedWord of seedArray) {
    counter++;
    if (seedArray.includes(seedWord, counter)) {
      return false;
    }
  }
  return true;
}

export default AccountProvider;
