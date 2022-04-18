import React, { useCallback } from "react";
import Context from "./Context";
import getAccount from "utils/api/getAccount";

export interface IGetAccountResult {
  account: string;
  accountRS: string;
  balanceNQT: string;
  description: string;
  forgedBalanceNQT: string;
  name: string;
  publicKey: string;
  unconfirmedBalanceNQT: string;
}

const APIProvider: React.FC = ({ children }) => {
  const handleGetAccount = useCallback(async (address: string) => {
    let result;
    let alias;

    try {
      result = await getAccount(address);
      alias = result.name || "Set Alias"; // Defaults to "Set Alias" if user has not set one
    } catch (e) {
      console.error("error getting account in APIProvider", e);
      return false;
    }
    return alias;
  }, []);

  return (
    <Context.Provider
      value={{
        getAccount: handleGetAccount,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default APIProvider;
