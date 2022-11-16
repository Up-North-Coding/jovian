import React, { useCallback, useEffect, useState } from "react";
import { IAccountAsset, IGetAccountAssetsResult, IGetAssetResult } from "types/NXTAPI";
import getAccountAssets from "utils/api/getAccountAssets";
import useAccount from "hooks/useAccount";
import useAPI from "hooks/useAPI";
import useBlocks from "hooks/useBlocks";
import Context from "./Context";
import { useSnackbar } from "notistack";
import { messageText } from "../../utils/common/messages";

const AssetProvider: React.FC = ({ children }) => {
  const [heldAssets, setHeldAssets] = useState<undefined | Array<IAccountAsset>>();
  const { getAsset } = useAPI();
  const { accountRs } = useAccount();
  const { blockHeight } = useBlocks();
  const { enqueueSnackbar } = useSnackbar();

  const fetchAccountAssets = useCallback(async () => {
    if (accountRs === undefined || getAsset === undefined) {
      return;
    }

    const assets: IGetAccountAssetsResult = await getAccountAssets(accountRs);

    if (assets?.error || assets?.results?.accountAssets === undefined) {
      enqueueSnackbar(messageText.errors.api.replace("{api}", "getAccountAssets"), { variant: "error" });
      return;
    }

    const finalAssets = await processAssetResults(assets.results.accountAssets, getAsset);

    setHeldAssets(finalAssets);
  }, [accountRs, enqueueSnackbar, getAsset]);

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
async function processAssetResults(
  assetsToProcess: Array<IAccountAsset>,
  processingFn: (assetId: string) => Promise<undefined | IGetAssetResult>
): Promise<undefined | IAccountAsset[]> {
  let assetRes: undefined | IGetAssetResult;
  for (const [index, asset] of assetsToProcess.entries()) {
    try {
      // call the processing function to retrieve additional details
      assetRes = await processingFn(asset.asset);
    } catch (e) {
      console.error("error while fetching additional asset details is processAssetResults()", e);
      return;
    }

    if (assetRes?.results) {
      // set additional details fetched from the processingFn()
      //This is close to what we want but it also includes an unnecessary requestprocessingtime property
      assetsToProcess[index].assetDetails = { ...assetRes.results };
    }
  }
  return assetsToProcess; // return the new array
}

export default AssetProvider;
