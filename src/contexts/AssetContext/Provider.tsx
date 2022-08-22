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
    let finalAssets: Array<IAsset> | undefined;

    if (getAccountAssets === undefined || accountRs === undefined || getAsset === undefined) {
      return;
    }

    const result: false | IGetAccountAssetsResult = await getAccountAssets(accountRs);

    if (result) {
      finalAssets = await processAssetResults(result.accountAssets, getAsset);
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
// such as name/description/decimals/totalSupply
async function processAssetResults(assetsToProcess: Array<IAsset>, processingFn: (assetId: string) => Promise<false | IGetAssetResult>) {
  for (const [index, asset] of assetsToProcess.entries()) {
    // call the processing function to retrieve additional details
    const result: false | IGetAssetResult = await processingFn(asset.asset);
    if (result) {
      // set additional details fetched from the processingFn()
      assetsToProcess[index].name = result.name;
      assetsToProcess[index].description = result.description;
      assetsToProcess[index].decimals = result.decimals;
    }
  }

  return assetsToProcess; // return the new array
}

export default AssetProvider;
