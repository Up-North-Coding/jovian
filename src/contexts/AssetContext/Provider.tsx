import React, { useCallback, useEffect, useState } from "react";
import { IAccountAsset, IGetAccountAssetsResult, IGetAssetResult } from "types/NXTAPI";
import useAccount from "hooks/useAccount";
import useAPI from "hooks/useAPI";
import useBlocks from "hooks/useBlocks";
import Context from "./Context";

const AssetProvider: React.FC = ({ children }) => {
  const [heldAssets, setHeldAssets] = useState<Array<IAccountAsset>>();
  const { getAccountAssets, getAsset } = useAPI();
  const { accountRs } = useAccount();
  const { blockHeight } = useBlocks();

  const fetchAccountAssets = useCallback(async () => {
    let finalAssets: Array<IAccountAsset> | undefined;

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
async function processAssetResults(assetsToProcess: Array<IAccountAsset>, processingFn: (assetId: string) => Promise<false | IGetAssetResult>) {
  for (const [index, asset] of assetsToProcess.entries()) {
    // call the processing function to retrieve additional details
    const result: false | IGetAssetResult = await processingFn(asset.asset);
    if (result) {
      // set additional details fetched from the processingFn()
      //This is close to what we want but it also includes an unnecessary requestprocessingtime property
      assetsToProcess[index].assetDetails = { ...result };
    }
  }
  return assetsToProcess; // return the new array
}

export default AssetProvider;
