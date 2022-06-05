import { Settings, Logout, Settings as SettingsIcon, Help as HelpIcon } from "@mui/icons-material";
import { Tooltip, IconButton, Menu, MenuItem, Avatar, Divider, ListItemIcon } from "@mui/material";
import React, { memo } from "react";

interface IJUPSettingsMenu {
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClose: () => void;
  menuProps: any;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const JUPSettingsMenu: React.FC<IJUPSettingsMenu> = ({ handleClick, anchorEl, open, handleClose, menuProps }) => {
  return (
    <>
      {" "}
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
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
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
        <MenuItem>
          <ListItemIcon>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          About
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default memo(JUPSettingsMenu);
