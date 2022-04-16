import { useContext } from "react";
import { AccountContext } from "../contexts/AccountContext";

const useAccount = () => ({
  ...useContext(AccountContext),
});

export default useAccount;
