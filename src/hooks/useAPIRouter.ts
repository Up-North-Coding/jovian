import { useContext } from "react";
import { APIRouterContext } from "../contexts/APIRouterContext";

const useAPIRouter = () => ({
  ...useContext(APIRouterContext),
});

export default useAPIRouter;
