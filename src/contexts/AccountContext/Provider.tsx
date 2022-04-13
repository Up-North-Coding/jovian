import React, { useCallback, useState } from "react";
import Context from "./Context";
import { generateNewWallet } from "utils/wallet";

const AccountProvider: React.FC = ({ children }) => {
  const [accountRs, setAccountRs] = useState<string>();
  const [accountSeed, setAccountSeed] = useState<string>();

  // creates a new seed, converts to accountRs format, sets it in state
  const fetchNewAccount = useCallback(async () => {
    const { accountRs, accountSeed } = await generateNewWallet();

    setAccountRs(accountRs);

    setAccountSeed(accountSeed);
  }, []);

  // flushes seed back to empty string after we're done using it
  const flushAccountSeed = useCallback(() => {
    setAccountSeed("");
  }, []);

  return (
    <Context.Provider
      value={{
        accountRs,
        accountSeed,
        fetchFn: fetchNewAccount,
        flushFn: flushAccountSeed,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AccountProvider;
