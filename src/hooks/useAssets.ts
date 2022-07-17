import { AssetContext } from "contexts/AssetContext";
import { useContext } from "react";

const useAssets = () => ({
  ...useContext(AssetContext),
});

export default useAssets;
