import React, { memo, useCallback, useEffect, useState } from "react";
import Page from "components/Page";
import Drawer from "../../components/Drawer";
import WidgetContainer from "views/Dashboard/components/WidgetContainer";
import useBreakpoint from "hooks/useBreakpoint";
import JUPAppBar from "components/JUPAppBar";
import PortfolioApp from "./components/Widgets/PortfolioApp";

const Portfolio: React.FC = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(true);
  const isMobileMedium = useBreakpoint("<", "md");

  const handleDrawerToggle = useCallback(() => {
    setDrawerIsOpen((prev: boolean) => !prev);
  }, []);

  // sets the drawer state when the mobile breakpoint is hit
  useEffect(() => {
    if (isMobileMedium) {
      setDrawerIsOpen(false);
      return;
    }
    setDrawerIsOpen(true);
  }, [isMobileMedium]);

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
