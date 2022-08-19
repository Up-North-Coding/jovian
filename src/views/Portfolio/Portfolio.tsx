import React, { memo, useCallback, useEffect, useState } from "react";
import Page from "components/Page";
import Drawer from "../../components/Drawer";
import WidgetContainer from "views/Dashboard/components/WidgetContainer";
import useBreakpoint from "hooks/useBreakpoint";
import JUPAppBar from "components/JUPAppBar";
import PortfolioApp from "./components/Widgets/PortfolioApp";

const Portfolio: React.FC = () => {
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
      <Drawer isSidebarExpanded={drawerIsOpen} />
      <JUPAppBar isSidebarExpanded={drawerIsOpen} toggleFn={handleDrawerToggle} />
      <WidgetContainer isSidebarExpanded={drawerIsOpen}>
        <PortfolioApp />
      </WidgetContainer>
    </Page>
  );
};

export default memo(Portfolio);
