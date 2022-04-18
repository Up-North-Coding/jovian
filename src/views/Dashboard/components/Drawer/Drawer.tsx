import React, { memo, useCallback, useState } from "react";
import { Button, Chip, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { Inbox, Mail } from "@mui/icons-material";
import useAccount from "hooks/useAccount";
import Logo from "components/Logo";
import getAccount from "utils/api/getAccount";

// TODO: handle better
const drawerWidth = 240;
const WalletDetails: React.FC = () => (
  <>
    <Logo width="100px" />
    <Typography>Jupiter Wallet version: {APP_VERSION}</Typography>
  </>
);
const UserDetails: React.FC = () => {
  const { accountRs, accountAlias } = useAccount();

  // const handleGetAccount = useCallback(() => {
  //   getAccount("JUP-XXXX-XXXX-XXXX-XXXXX");
  // }, []);

  return (
    <>
      <Chip label={accountRs} />
      <Chip label={accountAlias} />
      {/* <Button onClick={handleGetAccount}>Test API</Button> */}
    </>
  );
};
// TODO: Need to complete this nav list
const drawerItems = (
  <div>
    <WalletDetails />
    <UserDetails />
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
// TODO: rename NavDrawer?
const JUPDrawer: React.FC = () => {
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

export default memo(JUPDrawer);
