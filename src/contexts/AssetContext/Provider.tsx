import React, { useCallback, useEffect, useState } from "react";
import { IAsset, IGetAccountAssetsResult, IGetAssetResult } from "types/NXTAPI";
import useAccount from "hooks/useAccount";
import useAPI from "hooks/useAPI";
import useBlocks from "hooks/useBlocks";
import Context from "./Context";

const AssetProvider: React.FC = ({ children }) => {
  const [heldAssets, setHeldAssets] = useState<Array<IAsset>>();
  const { getAccountAssets, getAsset } = useAPI();
  const { accountRs } = useAccount();
  const { blockHeight } = useBlocks();

  const fetchAccountAssets = useCallback(async () => {
    let finalAssets;

    if (getAccountAssets === undefined || accountRs === undefined) {
      return;
    }

    const result: false | IGetAccountAssetsResult = await getAccountAssets(accountRs);

    if (result && getAsset) {
      finalAssets = processAssetResults(result.accountAssets, getAsset);
    }

    setHeldAssets(finalAssets);
  }, [accountRs, getAccountAssets, getAsset]);

  useEffect(() => {
    fetchAccountAssets();
  }, [accountRs, fetchAccountAssets, blockHeight]);

  return (
    <Context.Provider
      value={{
        heldAssets,
      }}
    >
      {children}
    </Context.Provider>
  );
};

//
// Helper functions
//

// Takes in the asset results from a getAccountAssets() call and fetches additional asset details
function processAssetResults(assetsToProcess: Array<IAsset>, processingFn: any) {
  assetsToProcess.forEach(async (asset, index) => {
    // make a secondary call to get the asset's name for more friendly display
    const result: false | IGetAssetResult = await processingFn(asset.asset);
    if (result) {
      console.log("Asset fetched:", result.name, result.description);

      // set name and description on the originally passed array
      assetsToProcess[index].name = result.name;
      assetsToProcess[index].description = result.description;
    }
  });

  console.log("returning new array with names and descr:", assetsToProcess);
  return assetsToProcess; // return the new array
}

export default AssetProvider;
