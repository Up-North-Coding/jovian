import React, { useCallback } from "react";
import { Autocomplete, Box, Button, FormGroup, Grid, Input, TextField, Typography } from "@mui/material";
import Page from "components/Page";
import WidgetContainer from "./components/WidgetContainer";
import Drawer from "./components/Drawer";
import MyToolbar from "./components/MyToolbar";
import sendJUP from "utils/api/sendJUP";

const placeHolderVals = ["JUP", "ASTRO"];

export interface ITransactionAttachment {
  "version.OrdinaryPayment": number;
}

// TODO: move to elsewhere
export interface IUnsignedTransaction {
  sender?: string;
  senderRS: string;
  recipient?: string;
  recipientRS: string;
  amountNQT: string;
  version: number;
  type: number;
  subtype: number;
  phased: boolean;
  attachment: ITransactionAttachment;
  senderPublicKey?: string;
  feeNQT: string;
  deadline: string;
}

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
    // test for now
    const unsignedTxTest: IUnsignedTransaction = {
      senderRS: "JUP-ABCD-ABCD-ABCD-EFGD",
      feeNQT: "5000",
      version: 1,
      phased: false,
      type: 0,
      subtype: 0,
      // sender: ?
      attachment: { "version.OrdinaryPayment": 0 },
      amountNQT: "100000000000",
      recipientRS: "JUP-ABCD-ABCD-ABCD-ABCDE",
      deadline: "5",
    };
    console.log("sending not implemented yet...calling utils sendJUP() anyway...");
    sendJUP(unsignedTxTest);
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
