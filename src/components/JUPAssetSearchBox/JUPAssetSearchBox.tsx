import React, { memo, useCallback, useState } from "react";
import { Autocomplete, TextField, TextFieldProps, styled } from "@mui/material";
import { defaultAssetList } from "utils/common/defaultAssets";
import useAPI from "hooks/useAPI";

// populates the autocomplete box with some known-good assets. Includes asset name and assetId
const placeHolderVals = defaultAssetList.map((asset) => {
  return `${asset.name} - ${asset.asset}`;
});

interface IJUPAssetSearchBoxProps {
  fetchFn: (asset: string) => void;
}

const JUPAssetSearchBox: React.FC<IJUPAssetSearchBoxProps> = ({ fetchFn }) => {
  const [searchBoxResults, setSearchBoxResults] = useState<Array<string>>(placeHolderVals);
  const { searchAssets } = useAPI();

  // when the second letter is entered, perform a search by asset name
  // if an assetID of certain length (are they predictable?) is entered, lookup by assetID
  const handleSearchEntry = useCallback(
    async (value: string | number) => {
      console.log("searching for:", value);

      if (value.toString().length > 1) {
        if (searchAssets === undefined) {
          return;
        }

        let result;
        console.log("length is longer than 1 character, performing search...");
        try {
          result = await searchAssets(value.toString());
          console.log("got result from search:", result);

          if (result && result?.assets) {
            setSearchBoxResults(
              result.assets.map((asset) => {
                return `${asset.name} - ${asset.asset}`;
              })
            );
          }
        } catch (e) {
          console.error("failed to search assets with error:", e);
          return;
        }
      }

      // revert the searchbox back to defaults if user deletes their entry
      setSearchBoxResults(placeHolderVals);
    },
    [searchAssets]
  );

  return (
    <StyledAutocomplete
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

const StyledAutocomplete = styled(Autocomplete)(() => ({
  width: "90%",
  padding: "10px",
  margin: "0px 10px",
}));

export default memo(JUPAssetSearchBox);
