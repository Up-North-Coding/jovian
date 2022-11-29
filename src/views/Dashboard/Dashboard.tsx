import React, { memo } from "react";
import { Grid } from "@mui/material";
import Page from "components/Page";
import SendWidget from "./components/Widgets/SendWidget";
import TransactionsWidget from "./components/Widgets/TransactionsWidget";
import BlocksWidget from "./components/Widgets/BlocksWidget";
import PortfolioWidget from "./components/Widgets/PortfolioWidget";
import DEXWidget from "./components/Widgets/DEXWidget";
import useBreakpoint from "hooks/useBreakpoint";

const Dashboard: React.FC = () => {
  const isMobileExtraLarge = useBreakpoint("<", "xl");
  const gridSize = isMobileExtraLarge ? 12 : 6; // switch from double-column to single-column for smaller screens

  return (
    <Page>
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
    </Page>
  );
};

export default memo(Dashboard);
