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
      sx={{ "& .Mui-focused": { width: "300px" } }} // very close but still has a strange bug where it doesn't expand all the time, requires two clicks. Also breaks this component's use on the dashboard
      fullWidth
      freeSolo
      options={searchBoxResults.map((searchBoxValue) => searchBoxValue)}
      onChange={(e, value) => value && fetchFn(value.split("-")[AssetIdIndex].trim())}
      renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
        <TextField {...params} onChange={(e) => handleSearchEntry(e.target.value)} label="Enter asset name" />
      )}
      PaperComponent={CustomPaper}
    />
  );
};

export default memo(JUPAssetSearchBox);
