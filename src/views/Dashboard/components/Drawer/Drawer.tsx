import React, { memo, useState } from "react";
import { Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { Inbox, Mail } from "@mui/icons-material";
import Logo from "components/Logo";
import UserInfo from "./components/UserInfo";

// TODO: handle better
const drawerWidth = 260;

const WalletDetails: React.FC = () => (
  <>
    <Logo width="100px" />
    <Typography>Jupiter Wallet version: {APP_VERSION}</Typography>
  </>
);

// TODO: Need to complete this nav list
const drawerItems = (
  <div>
    <WalletDetails />
    <UserInfo />
    <Toolbar />
    <Divider />
    <List>
      {["Dashboard", "My Transactions", "Portfolio", "DEX"].map((text, index) => (
        <ListItem button key={text}>
          <ListItemIcon>{index % 2 === 0 ? <Inbox /> : <Mail />}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  </div>
);

const NavDrawer: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
          <Mail />
        </IconButton>
      </Toolbar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawerItems}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawerItems}
      </Drawer>
    </>
  );
};

export default memo(NavDrawer);
