import React, { memo, useCallback, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Page from "components/Page";
import Drawer from "../../components/Drawer";
import SearchBar from "components/SearchBar";
import useBreakpoint from "hooks/useBreakpoint";
import WidgetContainer from "views/Dashboard/components/WidgetContainer";

const Transactions: React.FC = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(true);
  const isMobileLarge = useBreakpoint("<", "lg");
  const isMobileSmall = useBreakpoint("<", "sm");
  const gridSize = isMobileLarge ? 12 : 6; // switch from double-column to single-column for smaller screens

  const handleDrawerToggle = useCallback(() => {
    setDrawerIsOpen((prev: boolean) => !prev);
  }, []);

  // sets the drawer state when the mobile breakpoint is hit
  useEffect(() => {
    if (isMobileSmall) {
      setDrawerIsOpen(false);
      return;
    }
    setDrawerIsOpen(true);
  }, [isMobileSmall]);

  return (
    <Page>
      <WidgetContainer isSidebarExpanded={drawerIsOpen}>
        {/* True temporarily pased in here, eventually Drawer will be hoisted to the <Page> level */}
        <Drawer isSidebarExpanded={true} />
        <SearchBar />
        <Typography>Placeholder for the full Transactions page, coming soon.</Typography>
      </WidgetContainer>
    </Page>
  );
};

export default memo(Transactions);
