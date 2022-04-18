import React, { useCallback, useEffect, useState } from "react";
import Context from "./Context";
import { generateNewWallet } from "utils/wallet";
import getAccount from "utils/api/getAccount";

const AccountProvider: React.FC = ({ children }) => {
  const [accountRs, setAccountRs] = useState<string>();
  const [accountSeed, setAccountSeed] = useState<string>();
  const [accountAlias, setAccountAlias] = useState<string>();

  // Creates a new seed, converts to accountRs format, sets it in state
  const fetchNewAccount = useCallback(async () => {
    const { accountRs, accountSeed } = await generateNewWallet();

    setAccountRs(accountRs);

    setAccountSeed(accountSeed);
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
    if (accountRs === undefined) {
      return;
    }

    // function def required for async usage in useEffect
    const fetchAccount = async () => {
      const accountResult = await getAccount(accountRs);

      // How to best handle this since the API could return success or error
      //
      // I see a couple options
      //
      // API() determines if the call resulted in an error
      // getAccount() catches the error API() throws
      // getAccount() passes the required bits of info the user might need back to the user
      const alias = accountResult?.name;
      setAccountAlias(alias);
    };

    fetchAccount().catch(console.error);
  }, [accountRs]);

  return (
    <Context.Provider
      value={{
        accountRs,
        accountSeed,
        accountAlias,
        fetchFn: fetchNewAccount,
        flushFn: flushAccountSeed,
        userLogin: handleLogin,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AccountProvider;
