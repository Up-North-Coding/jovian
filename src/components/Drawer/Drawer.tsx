import React, { memo, useState } from "react";
import { Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import {
  Dashboard,
  Restore,
  CurrencyExchange,
  LibraryBooks,
  Newspaper,
  Twitter,
  Language,
  InstallMobile,
  InsertPhotoOutlined,
} from "@mui/icons-material";
import UserInfo from "./components/UserInfo";
import SLink from "components/SLink";
import WalletDetails from "components/WalletDetails";

// TODO: handle better
const drawerWidth = 260;

// Add items here to extend the navigation
const internalNavItems = [
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

const externalNavItems = [
  {
    icon: <Twitter />,
    text: "Twitter",
    url: "https://twitter.com/JUP_Project",
  },
  {
    icon: <Newspaper />,
    text: "Blog",
    url: "https://blog.gojupiter.tech/",
  },
  {
    icon: <Language />,
    text: "Main Website",
    url: "https://jup.io/",
  },
  {
    icon: <InstallMobile />,
    text: "Metis",
    url: "https://jup.io/metis-messenger",
  },
  {
    icon: <InsertPhotoOutlined />,
    text: "Leda",
    url: "https://leda.jup.io/",
  },
];

const DrawerContents = (
  <div>
    <WalletDetails />
    <UserInfo />
    <Divider />
    <List>
      {internalNavItems.map((item) => (
        <SLink href={item.url} key={item.text}>
          <ListItem button>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        </SLink>
      ))}
    </List>
    <Divider />
    <List>
      {externalNavItems.map((item) => (
        <SLink external href={item.url} key={item.text}>
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
        {DrawerContents}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {DrawerContents}
      </Drawer>
    </>
  );
};

export default memo(NavDrawer);
