import React, { memo, useMemo } from "react";
import { Divider, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  Dashboard as DashboardIcon, // alias to reduce confusion
  Restore as TransactionsIcon,
  CurrencyExchange as ExchangeIcon,
  LibraryBooks as PortfolioIcon,
  Newspaper as BlogIcon,
  Twitter as TwitterIcon,
  Language as MainSiteIcon,
  InstallMobile as MetisIcon,
  InsertPhotoOutlined as LedaIcon,
  Hub as PeerIcon,
  Widgets as BlocksIcon,
} from "@mui/icons-material";

import UserInfo from "./components/UserInfo";
import SLink from "components/SLink";
import WalletDetails from "components/WalletDetails";
import { JUPSidebarWidth } from "utils/common/constants";

// Add items here to extend the navigation
const internalNavItems = [
  {
    icon: <DashboardIcon />,
    text: "Dashboard",
    url: "/dashboard",
  },
  {
    icon: <TransactionsIcon />,
    text: "My Transactions",
    url: "/transactions",
  },
  {
    icon: <ExchangeIcon />,
    text: "Exchange",
    url: "/exchange",
  },
  {
    icon: <PortfolioIcon />,
    text: "Portfolio",
    url: "/portfolio",
  },
  {
    icon: <BlocksIcon />,
    text: "Blocks",
    url: "/blocks",
  },
  {
    icon: <PeerIcon />,
    text: "Peers",
    url: "/peers",
  },
];

const externalNavItems = [
  {
    icon: <TwitterIcon />,
    text: "Twitter",
    url: "https://twitter.com/JUP_Project",
  },
  {
    icon: <BlogIcon />,
    text: "Blog",
    url: "https://blog.gojupiter.tech/",
  },
  {
    icon: <MainSiteIcon />,
    text: "Main Website",
    url: "https://jup.io/",
  },
  {
    icon: <MetisIcon />,
    text: "Metis",
    url: "https://jup.io/metis-messenger",
  },
  {
    icon: <LedaIcon />,
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

interface INavDrawerProps {
  isSidebarExpanded: boolean;
}

const NavDrawer: React.FC<INavDrawerProps> = ({ isSidebarExpanded }) => {
  const ConditionalDrawer = useMemo(() => {
    return (
      <Drawer
        variant="persistent"
        open={isSidebarExpanded}
        sx={{
          display: "block",
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: isSidebarExpanded ? JUPSidebarWidth : "0px", overflowX: "hidden" },
        }}
      >
        {DrawerContents}
      </Drawer>
    );
  }, [isSidebarExpanded]);

  return <>{ConditionalDrawer}</>;
};

export default memo(NavDrawer);
