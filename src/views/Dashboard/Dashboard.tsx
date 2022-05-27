import React, { memo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import Page from "components/Page";
import WidgetContainer from "./components/WidgetContainer";
import Drawer from "../../components/Drawer";
import SendWidget from "./components/Widgets/SendWidget";
import TransactionsWidget from "./components/Widgets/TransactionsWidget";
import SearchBar from "components/SearchBar";
import BlocksWidget from "./components/Widgets/BlocksWidget";

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
  return (
    <Page>
      <Drawer />
      <SearchBar />
      <WidgetContainer>
        <Grid container>
          <Grid xs={6} item>
            <PortfolioWidget />
          </Grid>
          <Grid xs={6} item>
            <DEXWidget />
          </Grid>
          <Grid xs={6} item>
            <TransactionsWidget />
          </Grid>
          <Grid xs={6} item>
            <SendWidget />
          </Grid>
        </Grid>
        <Grid xs={12} item>
          <BlocksWidget />
        </Grid>
      </WidgetContainer>
    </Page>
  );
};

export default memo(Dashboard);
