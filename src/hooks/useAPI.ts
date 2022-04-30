import { useContext } from "react";
import { APIContext } from "../contexts/APIContext";

const useAPI = () => ({
  ...useContext(APIContext),
});

export default useAPI;
