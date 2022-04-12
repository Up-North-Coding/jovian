import React from "react";
import { Box, Button, Grid, Input, Typography } from "@mui/material";
import Page from "components/Page";
import WidgetContainer from "./components/WidgetContainer";
import Drawer from "./components/Drawer";
import MyToolbar from "./components/MyToolbar";

/* 
  Component selection considerations (design)

  Autocomplete - Combo Box demo 
    -- Primary search bar

*/

const PortfolioWidget: React.FC = () => {
  return (
    <Box sx={{ border: "1px dotted blue", margin: "10px", height: "300px" }}>
      <Typography>Portfolio</Typography>
    </Box>
  );
};

const TransactionsWidget: React.FC = () => {
  return (
    <Box sx={{ border: "1px dotted blue", margin: "10px", height: "300px" }}>
      <Typography>Transactions</Typography>
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

const SendWidget: React.FC = () => {
  return (
    <Box sx={{ border: "1px dotted blue", margin: "10px", height: "300px" }}>
      <Typography>Send JUP</Typography>
      <Input placeholder="To Address" />
      <br />
      <Input placeholder="Quantity" />

      <Button variant="outlined">Send Jup</Button>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  return (
    <Page>
      <Drawer />
      <MyToolbar />
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
      </WidgetContainer>
    </Page>
  );
};

export default React.memo(Dashboard);
