import React, { memo, useCallback, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Page from "components/Page";
import WidgetContainer from "./components/WidgetContainer";
import SendWidget from "./components/Widgets/SendWidget";
import TransactionsWidget from "./components/Widgets/TransactionsWidget";
import BlocksWidget from "./components/Widgets/BlocksWidget";
import JUPAppBar from "components/JUPAppBar";
import PortfolioWidget from "./components/Widgets/PortfolioWidget";
import DEXWidget from "./components/Widgets/DEXWidget";
import Drawer from "components/Drawer";
import useBreakpoint from "hooks/useBreakpoint";

const Dashboard: React.FC = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(true);
  const isMobileExtraLarge = useBreakpoint("<", "xl");
  const isMobileMedium = useBreakpoint("<", "md");
  const gridSize = isMobileExtraLarge ? 12 : 6; // switch from double-column to single-column for smaller screens

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
        <Grid container>
          <Grid xs={gridSize} item>
            <PortfolioWidget />
          </Grid>
          <Grid xs={gridSize} item>
            <DEXWidget />
          </Grid>
          <Grid xs={gridSize} item>
            <TransactionsWidget />
          </Grid>
          <Grid xs={gridSize} item>
            <SendWidget />
          </Grid>
        </Grid>

        <Grid container>
          {/* Blocks widget should always take up the full width, even in desktop version */}
          <Grid xs={12} item>
            <BlocksWidget />
          </Grid>
        </Grid>
      </WidgetContainer>
    </Page>
  );
};

export default memo(Dashboard);
