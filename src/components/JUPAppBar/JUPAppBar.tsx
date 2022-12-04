import React, { memo, useCallback, useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import { AppBar, Box, Toolbar, IconButton, InputBase, Autocomplete, TextField } from "@mui/material/";
import { Menu as MenuIcon, Search as SearchIcon } from "@mui/icons-material";
import JUPSettingsMenu from "components/JUPSettingsMenu";
import BlockheightChip from "components/SearchBar/components/BlockheightChip";
import AddressBook from "components/SearchBar/components/AddressBook";
import { JUPSidebarWidth } from "utils/common/constants";
import useBreakpoint from "hooks/useBreakpoint";
import { isValidAddress } from "../../utils/validation";
import useLocalStorage from "../../hooks/useLocalStorage";
import useAPI from "../../hooks/useAPI";
import SLink from "../SLink";

interface ISearchAppBarProps {
  isSidebarExpanded: boolean;
  toggleFn: () => void;
}

interface ISearchOption {
  label: string;
  url: string;
}

const placeHolderVals = [{ title: "test" }, { title: "hello" }];

const SearchAppBar: React.FC<ISearchAppBarProps> = ({ isSidebarExpanded, toggleFn }) => {
  const [value, setValue] = useState<string | null>(null);
  const [options, setOptions] = useState<ISearchOption[]>([]);

  const { searchInput, searchInputChange, handleFetchAccountIDFromRS } = useAPI();
  const isMobileSmall = useBreakpoint("<", "sm");

  const handleSearchOptions = useCallback(
    async (searchInput: string) => {
      const results: ISearchOption[] = [];

      if (isValidAddress(searchInput)) {
        if (handleFetchAccountIDFromRS === undefined) {
          return;
        }

        // search results to click on an address that's jup-* format
        const addressId = await handleFetchAccountIDFromRS(searchInput);
        if (addressId !== undefined) {
          results.push({ label: `Open ${searchInput} in Galileo`, url: "https://galileo.jup.io/account/" + addressId } as ISearchOption);
        }
      }

      // if the input is only numeric, then it can be any of:
      // tx, asset id, account id, block height
      // https://galileo.jup.io/block/NUMBER
      // https://galileo.jup.io/transaction/NUMBER
      // https://galileo.jup.io/asset/NUMBER
      // https://galileo.jup.io/account/NUMBER
      if (/^\d+$/.test(searchInput)) {
        const endpoints = ["block", "transaction", "asset", "account"];
        endpoints.forEach((endpoint) => {
          results.push({
            label: `Search ${searchInput} as ${endpoint} on Galileo`,
            url: `https://galileo.jup.io/${endpoint}/${searchInput}`,
          } as ISearchOption);
        });
      }

      setOptions(results);
    },
    [handleFetchAccountIDFromRS, setOptions]
  );

  useEffect(() => {
    console.log("render");
    if (searchInput === undefined || handleSearchOptions === undefined) {
      return;
    }

    handleSearchOptions(searchInput);
  }, [handleSearchOptions, searchInput]);

  return (
    // TODO: Not keen on this magic number, probably need to box these components out more intelligently so flex can handle this
    <Box sx={{ marginBottom: "65px" }}>
      <AppBar sx={{ width: "100%" }}>
        <Toolbar>
          <IconButton
            sx={{ marginLeft: isSidebarExpanded && !isMobileSmall ? `${JUPSidebarWidth}px` : "0px" }}
            size="large"
            edge="start"
            color="primary"
            aria-label="open drawer"
            onClick={toggleFn}
          >
            <MenuIcon />
          </IconButton>
          <StyledSearch>
            <Autocomplete
              sx={{ minWidth: 300, margin: "10px" }}
              size="small"
              freeSolo
              clearOnEscape
              clearOnBlur={false}
              autoSelect={false}
              options={options}
              filterOptions={(x) => x}
              onInputChange={(event, newInputValue) => {
                if (searchInputChange === undefined) {
                  return;
                }

                searchInputChange(newInputValue);
              }}
              // options are the dropdown options to select from
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <SLink href={option.url} external>
                    {option.label}
                  </SLink>
                </Box>
              )}
              // input is the user input field (search bar textfield)
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search..."
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
            />
          </StyledSearch>
          <BlockheightChip />
          <AddressBook />
          <JUPSettingsMenu />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const StyledSearch = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.05),
  },
  marginLeft: theme.spacing(1),
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    width: "auto",
  },
}));

const StyledSearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

export default memo(SearchAppBar);
