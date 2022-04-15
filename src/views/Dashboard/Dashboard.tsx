import React, { useCallback, useMemo, useState } from "react";
import { Autocomplete, Box, Button, FormGroup, Grid, Input, TextField, Typography } from "@mui/material";
import Page from "components/Page";
import WidgetContainer from "./components/WidgetContainer";
import Drawer from "./components/Drawer";
import MyToolbar from "./components/MyToolbar";
import sendJUP from "utils/api/sendJUP";
import useAccount from "hooks/useAccount";
import { isValidAddress } from "utils/validation";

const standardFee: string = "5000";

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
  const { accountRs } = useAccount();
  const [toAddress, setToAddress] = useState<string>();
  const [sendQuantity, setSendQuantity] = useState<string>();

  // keeps our unsigned tx up to date as it's updated by the user through various inputs
  const unsignedTx: IUnsignedTransaction | undefined = useMemo(() => {
    // if we don't have all the elements, don't return the object
    // might want to update this to include what it can so we can display what's still needed?
    if (accountRs === undefined || sendQuantity === undefined || toAddress === undefined) {
      return;
    }

    if (!isValidAddress(toAddress)) {
      return;
    }

    return {
      senderRS: accountRs, // accountRs from useAccount() hook
      feeNQT: standardFee, // TODO: advanced feature to specify fee?
      version: 1,
      phased: false,
      type: 0,
      subtype: 0,
      attachment: { "version.OrdinaryPayment": 0 },
      amountNQT: sendQuantity,
      recipientRS: toAddress,
      deadline: "5",
    };
  }, [accountRs, sendQuantity, toAddress]);

  const handleSend = useCallback(() => {
    if (unsignedTx !== undefined) {
      sendJUP(unsignedTx);
    }
  }, [unsignedTx]);

  const handleToAddressEntry = useCallback(
    (toAddressInput: string) => {
      setToAddress(toAddressInput);
    },
    [setToAddress]
  );

  const handleQuantityEntry = useCallback((quantityInput: string) => {
    setSendQuantity(quantityInput);
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
          Send
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
