import React, { memo, useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { AppBar, styled } from "@mui/material";
import AddressBook from "components/SearchBar/components/AddressBook";
import BlockheightChip from "components/SearchBar/components/BlockheightChip";
import JUPSettingsMenu from "components/JUPSettingsMenu";

const drawerWidth = 240;

const menuProps = {
  elevation: 0,
  sx: {
    overflow: "visible",
    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
    mt: 1.5,
    "& .MuiAvatar-root": {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    "&:before": {
      content: '""',
      display: "block",
      position: "absolute",
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: "background.paper",
      transform: "translateY(-50%) rotate(45deg)",
      zIndex: 0,
    },
  },
};

// Placeholder values for the autocomplete
const placeHolderVals = ["test", "hello"];

const SearchBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <JUPSettingsMenu handleClick={handleClick} anchorEl={anchorEl} open={open} handleClose={handleClose} menuProps={menuProps}></JUPSettingsMenu>
      </SearchStack>
    </AppBar>
  );
};

const SearchStack = styled(Stack)(() => ({
  justifyContent: "center",
  alignItems: "center",
}));

export default memo(SearchBar);
