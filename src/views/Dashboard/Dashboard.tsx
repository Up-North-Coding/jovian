import React, { useCallback } from "react";
import { Autocomplete, Box, Button, FormGroup, Grid, Input, TextField, Typography } from "@mui/material";
import Page from "components/Page";
import WidgetContainer from "./components/WidgetContainer";
import Drawer from "./components/Drawer";
import MyToolbar from "./components/MyToolbar";
import sendJUP from "utils/api/sendJUP";

const placeHolderVals = ["JUP", "ASTRO"];

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
  const handleSend = useCallback(() => {
    console.log("sending not implemented yet...calling utils sendJUP() anyway...");
    sendJUP("test");
  }, []);

  const handleToAddressEntry = useCallback((toAddressInput: string) => {
    console.log("to address:", toAddressInput);
  }, []);

  const handleQuantityEntry = useCallback((toAddressInput: string) => {
    console.log("quantity:", toAddressInput);
  }, []);

  return (
    <Box sx={{ border: "1px dotted green", margin: "10px", height: "300px" }}>
      <FormGroup>
        <Typography>Send JUP</Typography>
        <Autocomplete
          sx={{ width: 200 }}
          freeSolo
          options={placeHolderVals.map((option) => option)}
          renderInput={(params) => <TextField {...params} label="Enter asset name" />}
        />
        <Input onChange={(e) => handleToAddressEntry(e.target.value)} placeholder="To Address" />
        <br />
        <Input onChange={(e) => handleQuantityEntry(e.target.value)} placeholder="Quantity" />

        <Button onClick={handleSend} variant="outlined">
          Send Jup
        </Button>
      </FormGroup>
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
