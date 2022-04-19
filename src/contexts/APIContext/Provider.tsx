import React, { useCallback } from "react";
import Context from "./Context";
import getAccount from "utils/api/getAccount";
import sendJUP from "utils/api/sendJUP";

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
    let account;
    let alias;

    try {
      account = await getAccount(address);
      // alias = account.name || "Set Alias"; // Defaults to "Set Alias" if user has not set one
    } catch (e) {
      console.error("error getting account in APIProvider", e);
      return false;
    }
    return account;
  }, []);

  const handleSendJUP = useCallback(async (unsignedTxJSON: any) => {
    console.log("handling sendJUP from provider...", unsignedTxJSON);
    return sendJUP(unsignedTxJSON); // return the result back to the caller so they can work with the whole signed object/error for now
  }, []);

  return (
    <Context.Provider
      value={{
        getAccount: handleGetAccount,
        sendJUP: handleSendJUP,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default APIProvider;
