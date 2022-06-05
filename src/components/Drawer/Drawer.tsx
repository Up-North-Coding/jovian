import React, { memo, useMemo, useState } from "react";
import { Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, styled, Toolbar, Tooltip, Typography } from "@mui/material";
import {
  Dashboard as DashboardIcon, // alias to reduce confusion
  DoubleArrow as DoubleArrowIcon, // alias to reduce confusion
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
import { JUPSidebarMiniWidth, JUPSidebarWidth } from "utils/common/constants";

// Add items here to extend the navigation
const internalNavItems = [
  {
    icon: <DashboardIcon />,
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

interface IDrawerToggleButton {
  toggleFn?: () => void;
}

const DrawerToggleButton: React.FC<IDrawerToggleButton> = ({ toggleFn }) => {
  return (
    <>
      <Tooltip title="Expand/Collapse">
        <IconButton aria-label="open drawer" onClick={toggleFn}>
          <DoubleArrowIcon />
        </IconButton>
      </Tooltip>
    </>
  );
};
const NavDrawer: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  // This whole thing works best as a memo since we need to coniditially change the way it's displayed for mobile
  const ConditionalDrawer = useMemo(() => {
    return mobileOpen ? (
      <Drawer
        variant="persistent"
        open={mobileOpen}
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: JUPSidebarWidth },
        }}
      >
        <DrawerToggleButton toggleFn={handleDrawerToggle} />
        {DrawerContents}
      </Drawer>
    ) : (
      <DrawerToggleButton />
    );
  }, [mobileOpen]);

  // ensures the navbar starts in an opened state
  if (mobileOpen === undefined) {
    return <></>;
  }

  return <>{ConditionalDrawer}</>;
};

export default memo(NavDrawer);
