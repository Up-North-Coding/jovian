import React, { memo, useCallback, useState } from "react";
import { Autocomplete, TextField, TextFieldProps } from "@mui/material";
import { defaultAssetList } from "utils/common/defaultAssets";
import { isValidAssetID } from "utils/validation";
import useAPI from "hooks/useAPI";

// populates the autocomplete box with some known-good assets. Includes asset name and assetId
const defaultAssets = defaultAssetList.map((asset) => {
  return `${asset.name} - ${asset.asset}`;
});

interface IJUPAssetSearchBoxProps {
  fetchFn: (asset: number) => void;
}

const JUPAssetSearchBox: React.FC<IJUPAssetSearchBoxProps> = ({ fetchFn }) => {
  const [searchBoxResults, setSearchBoxResults] = useState<Array<string>>(defaultAssets);
  const { getAsset, searchAssets } = useAPI();

  const handleSearchEntry = useCallback(
    async (value: string) => {
      console.log("searching for:", value);
      let result;

      // start aiding the user in their search after they've entered at least three letters preventing
      // spammy API calls which are likely to result in large responses
      if (value.length > 2) {
        if (searchAssets === undefined || getAsset === undefined) {
          return;
        }

        // If we've got an assetId we want to do a getAsset on it instead of a searchAssets
        if (isValidAssetID(value)) {
          try {
            result = await getAsset(value);
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
          result = await searchAssets(value);
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
      setSearchBoxResults(defaultAssets);
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
