import React, { memo } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { AppBar } from "@mui/material";
import AddressBook from "../AddressBook";
import BlockheightChip from "components/BlockheightChip";

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
    <Stack direction="row" spacing={2} sx={{ justifyContent: "center", alignItems: "center" }}>
      <Autocomplete
        sx={{ minWidth: 300, margin: "10px" }}
        size="small"
        freeSolo
        options={placeHolderVals.map((option) => option)}
        renderInput={(params) => <TextField {...params} label="Search" />}
      />
      <AddressBook />
      <BlockheightChip />
    </Stack>
  </AppBar>
);

export default memo(SearchBar);
