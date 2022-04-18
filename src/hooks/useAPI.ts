import { useContext } from "react";
import { APIContext } from "../contexts/APIContext";

const useAccount = () => ({
  ...useContext(APIContext),
});

export default useAccount;
