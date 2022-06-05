import React, { memo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import Page from "components/Page";
import WidgetContainer from "./components/WidgetContainer";
import SendWidget from "./components/Widgets/SendWidget";
import TransactionsWidget from "./components/Widgets/TransactionsWidget";
import SearchBar from "components/SearchBar";
import BlocksWidget from "./components/Widgets/BlocksWidget";
import Drawer from "components/Drawer";
import useBreakpoint from "hooks/useBreakpoint";
import JUPAppBar from "components/JUPAppBar";

const PortfolioWidget: React.FC = () => {
  return (
    <Box sx={{ border: "1px dotted blue", margin: "10px", height: "300px" }}>
      <Typography>Portfolio</Typography>
    </Box>
  );
};

const DEXWidget: React.FC = () => {
  return (
    <Box sx={{ border: "1px dotted blue", margin: "10px", height: "300px" }}>
      <Typography>DEX Widget</Typography>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const isMobileLarge = useBreakpoint("<", "lg");
  const isMobileSmall = useBreakpoint("<", "sm");
  const gridSize = isMobileLarge ? 12 : 6; // switch from double-column to single-column for small screens

  return (
    <Page>
      <Drawer />
      <JUPAppBar />
      <WidgetContainer>
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

        {/* Blocks widget should always take up the full width, even in desktop version */}
        <Grid xs={12} item>
          <BlocksWidget />
        </Grid>
      </WidgetContainer>
    </Page>
  );
};

export default memo(Dashboard);
