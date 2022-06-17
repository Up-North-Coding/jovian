import React, { memo, useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { AppBar, Avatar, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, styled, Tooltip } from "@mui/material";
import AddressBook from "components/SearchBar/components/AddressBook";
import BlockheightChip from "components/SearchBar/components/BlockheightChip";
import SettingsIcon from "@mui/icons-material/Settings";
import { Logout, Settings } from "@mui/icons-material";
import HelpIcon from "@mui/icons-material/Help";
import useAccount from "hooks/useAccount";
import SLink from "components/SLink";
import JUPSettingsMenu from "components/JUPSettingsMenu";

const drawerWidth = 240;

// Placeholder values for the autocomplete
const placeHolderVals = ["test", "hello"];

const SearchBar: React.FC = () => {
  return (
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
        <JUPSettingsMenu />
      </SearchStack>
    </AppBar>
  );
};

// MUST: Figure out how to style this with the theme (theme.palette.primary has no effect)
const StyledLogout = styled(ListItemText)(({ theme }) => ({
  "& .MuiListItemText-primary": {
    color: "red",
  },
}));

const SearchStack = styled(Stack)(() => ({
  justifyContent: "center",
  alignItems: "center",
}));

export default memo(SearchBar);
