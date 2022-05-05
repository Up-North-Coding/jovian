import React, { memo } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { AppBar, styled } from "@mui/material";
import AddressBook from "components/SearchBar/components/AddressBook";
import BlockheightChip from "components/SearchBar/components/BlockheightChip";

const drawerWidth = 240;

// Placeholder values for the autocomplete
const placeHolderVals = ["test", "hello"];

const SearchBar: React.FC = () => (
  <AppBar
    position="fixed"
    sx={{
      width: { sm: `calc(100% - ${drawerWidth}px)` },
      ml: { sm: `${drawerWidth}px` },
    }}
  >
    <SearchStack direction="row" spacing={2}>
      <Autocomplete
        sx={{ minWidth: 300, margin: "10px" }}
        size="small"
        freeSolo
        options={placeHolderVals.map((option) => option)}
        renderInput={(params) => <TextField {...params} label="Search" />}
      />
      <AddressBook />
      <BlockheightChip />
    </SearchStack>
  </AppBar>
);

const SearchStack = styled(Stack)(() => ({
  justifyContent: "center",
  alignItems: "center",
}));

export default memo(SearchBar);
