import { useContext } from "react";
import { AccountContext } from "../contexts/AccountContext";

const useAccount = () => {
  return {
    ...useContext(AccountContext),
  };
};

export default useAccount;
