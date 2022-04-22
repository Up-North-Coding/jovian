import React, { useCallback } from "react";
import Context from "./Context";
import getAccount from "utils/api/getAccount";
import sendJUP from "utils/api/sendJUP";
import getAccountId from "utils/api/getAccountId";
import { IGetAccountResult, IUnsignedTransaction } from "types/NXTAPI";

const APIProvider: React.FC = ({ children }) => {
  const handleGetAccount = useCallback(async (address: string) => {
    let account: IGetAccountResult;

    try {
      account = await getAccount(address);
    } catch (e) {
      console.error("error getting account in APIProvider", e);
      return false;
    }
    return account;
  }, []);

  const handleSendJUP = useCallback(async (unsignedTxJSON: IUnsignedTransaction) => {
    return sendJUP(unsignedTxJSON); // return the result back to the caller so they can work with the whole signed object/error for now
  }, []);

  return (
    <Context.Provider
      value={{
        getAccount: handleGetAccount,
        getAccountId,
        sendJUP: handleSendJUP,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default APIProvider;
