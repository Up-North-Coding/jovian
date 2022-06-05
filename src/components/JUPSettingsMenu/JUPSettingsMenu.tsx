import { Settings, Logout, Settings as SettingsIcon, Help as HelpIcon } from "@mui/icons-material";
import { Tooltip, IconButton, Menu, MenuItem, Avatar, Divider, ListItemIcon } from "@mui/material";
import React, { memo } from "react";

interface IJUPSettingsMenu {
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClose: () => void;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
}

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

const JUPSettingsMenu: React.FC<IJUPSettingsMenu> = ({ handleClick, anchorEl, open, handleClose }) => {
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
