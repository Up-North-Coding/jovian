import React, { useCallback, useEffect, useState } from "react";
import Context from "./Context";
import { generateNewWallet } from "utils/wallet";
import useAPI from "hooks/useAPI";

const AccountProvider: React.FC = ({ children }) => {
  const [accountRs, setAccountRs] = useState<string>();
  const [accountSeed, setAccountSeed] = useState<string>();
  const [accountAlias, setAccountAlias] = useState<string>();
  const [publicKey, setPublicKey] = useState<string>();
  const { getAccount } = useAPI();

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

  const handleLogin = useCallback((account: string) => {
    setAccountRs(account);
  }, []);

  // Flushes seed back to empty string after we're done using it
  const flushAccountSeed = useCallback(() => {
    setAccountSeed("");
  }, []);

  // once accountRs is set, useEffect sets the accountAlias into context
  useEffect(() => {
    if (accountRs === undefined || getAccount === undefined) {
      return;
    }

    // function def required for async usage in useEffect
    const fetchAccount = async () => {
      // TODO: update to this format: await getAccount(accountRs, "ERR_GET_ACCOUNT_DURING_LOGIN");
      // TODO: do something with errors (snackbar or other error notification system)
      // pass in a string/mapped string which represents what the user's feedback is during error
      const result = await getAccount(accountRs);
      if (result) {
        setAccountAlias(result.name || "Set Alias"); // defaults to "Set Alias" if user hasn't set one
        setPublicKey(result.publicKey);
      }
    };

    fetchAccount().catch(console.error);
  }, [accountRs, getAccount]);

  return (
    <Context.Provider
      value={{
        accountRs,
        accountSeed,
        accountAlias,
        publicKey,
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
