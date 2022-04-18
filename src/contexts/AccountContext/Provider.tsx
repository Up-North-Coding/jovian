import React, { useCallback, useEffect, useState } from "react";
import Context from "./Context";
import { generateNewWallet } from "utils/wallet";
import useAPI from "hooks/useAPI";
import { IGetAccountResult } from "contexts/APIContext/Provider";

const AccountProvider: React.FC = ({ children }) => {
  const [accountRs, setAccountRs] = useState<string>();
  const [accountSeed, setAccountSeed] = useState<string>();
  const [accountAlias, setAccountAlias] = useState<string>();
  const { getAccount } = useAPI();

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
    if (accountRs === undefined || getAccount === undefined) {
      return;
    }

    let result: IGetAccountResult;
    let alias: string;
    // function def required for async usage in useEffect
    const fetchAccount = async () => {
      // TODO: update to this format: const accountResult = await getAccount(accountRs, "ERR_GET_ACCOUNT_DURING_LOGIN");
      // pass in a string/mapped string which represents what the user's feedback is during error

      result = await getAccount(accountRs);
      alias = result?.name || "Set Alias"; // Defaults to "Set Alias" if user has not set one
      setAccountAlias(alias);
    };

    fetchAccount().catch(console.error);
  }, [accountRs, getAccount]);

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
