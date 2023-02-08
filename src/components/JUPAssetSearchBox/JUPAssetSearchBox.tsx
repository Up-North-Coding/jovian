import React, { memo, useCallback, useState } from "react";
import { Autocomplete, Paper, TextField, TextFieldProps } from "@mui/material";
import { defaultAssetList } from "utils/common/defaultAssets";
import { isValidAssetID } from "utils/validation";
import useAPI from "hooks/useAPI";

const AssetIdIndex = 1; // index for the asset id from an "asset name - asset index" string

// populates the autocomplete box with some known-good assets. Includes asset name and assetId
const defaultAssets = defaultAssetList.map((asset) => {
  return `${asset.name} - ${asset.asset}`;
});

const CustomPaper: React.FC = (props) => {
  return <Paper {...props} sx={{ whiteSpace: "nowrap" }}></Paper>;
};

interface IJUPAssetSearchBoxProps {
  fetchFn: (asset: string) => void;
}

const JUPAssetSearchBox: React.FC<IJUPAssetSearchBoxProps> = ({ fetchFn }) => {
  const [isLoadingResults, setIsLoadingResults] = useState<boolean>(false);
  const [searchBoxResults, setSearchBoxResults] = useState<Array<string>>(defaultAssets);
  const { getAsset, searchAssets } = useAPI();

  const handleSearchEntry = useCallback(
    async (value: string) => {
      setIsLoadingResults(true);
      let apiReq;

      // start aiding the user in their search after they've entered at least three letters preventing
      // spammy API calls which are likely to result in large responses
      // TODO: debounce
      if (value.length > 2) {
        if (searchAssets === undefined || getAsset === undefined) {
          return;
        }

        // If we've got an assetId we want to do a getAsset on it instead of a searchAssets
        if (isValidAssetID(value)) {
          try {
            apiReq = await getAsset(value);
            if (apiReq?.results?.name && apiReq?.results?.asset) {
              setSearchBoxResults([`${apiReq.results.name} - ${apiReq.results.asset}`]);
              return;
            }
          } catch (e) {
            console.error("error while performing getAsset() from JUPAssetSearchBox");
            return;
          }
        }

        // If we got here we're just doing a regular searchAssets request
        try {
          apiReq = await searchAssets(value);
          if (apiReq?.error || apiReq?.results?.assets === undefined) {
            return;
          }

          setSearchBoxResults(
            apiReq.results.assets.map((asset) => {
              return `${asset.name} - ${asset.asset}`;
            })
          );
          setIsLoadingResults(false);
          return;
        } catch (e) {
          console.error("failed to search assets with error:", e);
          return;
        }
      }

      // revert the searchbox back to defaults if user deletes their entry
      setSearchBoxResults(defaultAssets);
      setIsLoadingResults(false);
    },
    [getAsset, searchAssets]
  );

  return (
    <Autocomplete
      sx={{ minWidth: "350px" }}
      loading={isLoadingResults}
      fullWidth
      freeSolo
      options={searchBoxResults.map((searchBoxValue) => searchBoxValue)}
      onChange={(e, value) => value && fetchFn(value.split("-")[AssetIdIndex].trim())}
      renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
        <TextField {...params} sx={{ marginBottom: "10px" }} onChange={(e) => handleSearchEntry(e.target.value)} label="Enter asset name" />
      )}
      PaperComponent={CustomPaper}
    />
  );
};

export default memo(JUPAssetSearchBox);
