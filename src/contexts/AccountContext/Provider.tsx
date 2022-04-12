import React, { useCallback, useMemo, useState } from "react";
import Context from "./Context";
import { generateNewWallet } from "utils/wallet";

const AccountProvider: React.FC = ({ children }) => {
  const [accountRs, setAccountRs] = useState<string>();
  const [accountSeed, setAccountSeed] = useState<string>();
  const [accountAlias, setAccountAlias] = useState<string>();

  // creates a new seed, converts to accountRs format, sets it in state
  const fetchNewAccount = useCallback(async () => {
    const { accountRs, accountSeed } = await generateNewWallet();

    setAccountRs(accountRs);

    setAccountSeed(accountSeed);
  }, []);

  const handleLogin = useCallback((account: string) => {
    setAccountRs(account);
  }, []);

  // flushes seed back to empty string after we're done using it
  const flushAccountSeed = useCallback(() => {
    setAccountSeed("");
  }, []);

  const fetchAccountAlias = useMemo(() => {
    // TODO: fetch the actual alias using a utils call
    setAccountAlias("testAlias123");
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
