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
  const { userLogout } = useAccount();

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
        <Tooltip title="Account settings">
          <IconButton onClick={handleClick} color="primary">
            <SettingsIcon></SettingsIcon>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={menuProps}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem>
            <Avatar /> My account
          </MenuItem>
          <Divider />
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem divider>
            <ListItemIcon>
              <HelpIcon fontSize="small" />
            </ListItemIcon>
            About
          </MenuItem>
          <SLink href={"/"}>
            <MenuItem onClick={userLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <StyledLogout primary="Logout" />
            </MenuItem>
          </SLink>
        </Menu>
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
