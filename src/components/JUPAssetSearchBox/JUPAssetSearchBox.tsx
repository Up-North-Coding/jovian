import React, { memo, useCallback, useState } from "react";
import { Autocomplete, TextField, TextFieldProps } from "@mui/material";
import { defaultAssetList } from "utils/common/defaultAssets";
import { isValidAssetID } from "utils/validation";
import useAPI from "hooks/useAPI";

// populates the autocomplete box with some known-good assets. Includes asset name and assetId
const placeHolderVals = defaultAssetList.map((asset) => {
  return `${asset.name} - ${asset.asset}`;
});

interface IJUPAssetSearchBoxProps {
  fetchFn: (asset: number) => void;
}

const JUPAssetSearchBox: React.FC<IJUPAssetSearchBoxProps> = ({ fetchFn }) => {
  const [searchBoxResults, setSearchBoxResults] = useState<Array<string>>(placeHolderVals);
  const { getAsset, searchAssets } = useAPI();

  // when the second letter is entered, perform a search by asset name
  // if an assetID of certain length (are they predictable?) is entered, lookup by assetID
  const handleSearchEntry = useCallback(
    async (value: string | number) => {
      console.log("searching for:", value);
      let result;

      if (value.toString().length > 2) {
        if (searchAssets === undefined || getAsset === undefined) {
          return;
        }

        // If we've got an assetId we want to do a getAsset on it instead of a searchAssets
        if (isValidAssetID(value.toString())) {
          try {
            result = await getAsset(value.toString());
            if (result) {
              setSearchBoxResults([`${result.name} - ${result.asset}`]);
              return;
            }
          } catch (e) {
            console.error("error while performing getAsset() from JUPAssetSearchBox");
            return;
          }
        }

        // If we got here we're just doing a regular searchAssets request
        try {
          result = await searchAssets(value.toString());
          if (result && result?.assets) {
            setSearchBoxResults(
              result.assets.map((asset) => {
                return `${asset.name} - ${asset.asset}`;
              })
            );
            return;
          }
        } catch (e) {
          console.error("failed to search assets with error:", e);
          return;
        }
      }

      // revert the searchbox back to defaults if user deletes their entry
      setSearchBoxResults(placeHolderVals);
    },
    [getAsset, searchAssets]
  );

  return (
    <Autocomplete
      freeSolo
      options={searchBoxResults.map((searchBoxValue) => searchBoxValue)}
      // MUST: fix magic number? currently splits the value and takes the asset id portion (first index), might be able to do this more cleanly
      onChange={(e, value: any) => value && fetchFn(value.split("-")[1].trim())}
      renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
        <TextField {...params} onChange={(e) => handleSearchEntry(e.target.value)} label="Enter asset name" />
      )}
    />
  );
};

export default memo(JUPAssetSearchBox);
