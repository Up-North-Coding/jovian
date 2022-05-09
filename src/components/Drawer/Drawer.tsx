import React, { memo, useState } from "react";
import { Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, styled, Toolbar, Typography } from "@mui/material";
import { Dashboard, Restore, CurrencyExchange, LibraryBooks } from "@mui/icons-material";
import Logo from "components/Logo";
import UserInfo from "./components/UserInfo";
import SLink from "components/SLink";

// TODO: handle better
const drawerWidth = 260;

// Add items here to extend the navigation
const navItems = [
  {
    icon: <Dashboard />,
    text: "Dashboard",
    url: "/dashboard",
  },
  {
    icon: <Restore />,
    text: "My Transactions",
    url: "/transactions",
  },
  {
    icon: <CurrencyExchange />,
    text: "Exchange",
    url: "/exchange",
  },
  {
    icon: <LibraryBooks />,
    text: "Portfolio",
    url: "/portfolio",
  },
];

const WalletDetails: React.FC = () => (
  <>
    <Stack direction="row">
      <Logo width="100px" padding="10px" />
      <JupiterVersion>Jupiter Wallet version: {APP_VERSION}</JupiterVersion>
    </Stack>
  </>
);

const drawerItems = (
  <div>
    <WalletDetails />
    <UserInfo />
    <Divider />
    <List>
      {navItems.map((item) => (
        <SLink href={item.url} key={item.text}>
          <ListItem button>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        </SLink>
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
          <Dashboard />
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

const JupiterVersion = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export default memo(NavDrawer);
