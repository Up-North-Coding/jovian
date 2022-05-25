import { useContext } from "react";
import { MyTxContext } from "../contexts/MyTxContext";

const useMyTxs = () => ({
  ...useContext(MyTxContext),
});

export default useMyTxs;
