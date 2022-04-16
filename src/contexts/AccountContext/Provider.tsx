import React, { useCallback, useEffect, useState } from "react";
import Context from "./Context";
import { generateNewWallet } from "utils/wallet";

const AccountProvider: React.FC = ({ children }) => {
  const [accountRs, setAccountRs] = useState<string>(),
    [accountSeed, setAccountSeed] = useState<string>(),
    [accountAlias, setAccountAlias] = useState<string>(),
    // Creates a new seed, converts to accountRs format, sets it in state
    fetchNewAccount = useCallback(async () => {
      const { accountRs, accountSeed } = await generateNewWallet();

      setAccountRs(accountRs);

      setAccountSeed(accountSeed);
    }, []),
    handleLogin = useCallback((account: string) => {
      setAccountRs(account);
    }, []),
    // Flushes seed back to empty string after we're done using it
    flushAccountSeed = useCallback(() => {
      setAccountSeed("");
    }, []);

  useEffect(() => {
    // TODO: fetch the actual alias using a utils call
    setAccountAlias("testAlias123");
  }, []);

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
