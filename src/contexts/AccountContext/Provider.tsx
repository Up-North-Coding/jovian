import React, { useCallback, useEffect, useState } from "react";
import { generateNewWallet } from "utils/wallet";
import Context from "./Context";
import useAPI from "hooks/useAPI";
import useAuth from "hooks/useAuth";

const AccountProvider: React.FC = ({ children }) => {
  const [accountRs, setAccountRs] = useState<string>();
  const [accountSeed, setAccountSeed] = useState<string>();
  const [accountName, setAccountName] = useState<string>();
  const [publicKey, setPublicKey] = useState<string>();
  const [balance, setBalance] = useState<string>();
  const { getAccount, getBalance } = useAPI();
  const { signIn } = useAuth();

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

  // Flushes seed back to empty string after we're done using it
  const flushAccountSeed = useCallback(() => {
    setAccountSeed("");
  }, []);

  // once accountRs is set, useEffect sets the accountName into context and gets JUP balance
  useEffect(() => {
    if (accountRs === undefined || getAccount === undefined || getBalance === undefined) {
      return;
    }

    // function def required for async usage in useEffect
    const fetchAccount = async () => {
      // TODO: update to this format: await getAccount(accountRs, "ERR_GET_ACCOUNT_DURING_LOGIN");
      // TODO: do something with errors (snackbar or other error notification system)
      // pass in a string/mapped string which represents what the user's feedback is during error
      const accountResult = await getAccount(accountRs);
      const balanceResult = await getBalance(accountRs);
      if (accountResult && balanceResult) {
        setAccountName(accountResult.name || "Set Name"); // defaults to "Set Name" if user hasn't set one
        setBalance(balanceResult.balanceNQT || "unknown");
        setPublicKey(accountResult.publicKey);
      }
    };

    fetchAccount().catch(console.error);
  }, [accountRs, getAccount, getBalance]);

  return (
    <Context.Provider
      value={{
        accountRs,
        accountSeed,
        accountName,
        publicKey,
        balance,
        fetchFn: fetchNewAccount,
        flushFn: flushAccountSeed,
        userLogin: handleLogin,
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
