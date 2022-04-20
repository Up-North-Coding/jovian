import React, { memo, useCallback, useState } from "react";
import { Autocomplete, Box, Button, FormGroup, Grid, Input, styled, TextField, Typography } from "@mui/material";
import Page from "components/Page";
import WidgetContainer from "./components/WidgetContainer";
import Drawer from "./components/Drawer";
import MyToolbar from "./components/MyToolbar";
import useAccount from "hooks/useAccount";
import { isValidAddress } from "utils/validation";
import useAPI from "hooks/useAPI";

// TODO: implement as advanced features?
const standardFee = "5000";
const standardDeadline = 1440;

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
  deadline: number;
}

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
  const { accountRs, publicKey } = useAccount();
  const [toAddress, setToAddress] = useState<string>("");
  const [sendQuantity, setSendQuantity] = useState<string>();
  const { sendJUP, getAccount, getAccountId } = useAPI();

  const fetchRecipAccountId = useCallback(async () => {
    if (getAccount !== undefined && getAccountId !== undefined) {
      try {
        const result = await getAccount(toAddress);
        const accountResult = await getAccountId(result.publicKey);
        return accountResult.account;
      } catch (e) {
        console.error("error while fetching public key:", e);
        return;
      }
    }
  }, [getAccount, getAccountId, toAddress]);

  // need a final useEffect which gets run when all other pieces are ready to build the transaction
  const prepareUnsignedTx = useCallback(async () => {
    // make sure address is valid
    if (!isValidAddress(toAddress)) {
      return;
    }

    const recipientAccountId = await fetchRecipAccountId();
    const tx = {
      senderPublicKey: publicKey, // publicKey from useAccount() hook
      senderRS: accountRs, // accountRs from useAccount() hook
      // sender: "123", // required in some situations?
      feeNQT: standardFee,
      version: 1,
      phased: false,
      type: 0,
      subtype: 0,
      attachment: { "version.OrdinaryPayment": 0 },
      amountNQT: sendQuantity, // TODO: write converter function
      recipientRS: toAddress,
      recipient: recipientAccountId,
      ecBlockHeight: 0, // must be included
      deadline: standardDeadline,
      timestamp: 141752852, // TODO: implement properly
    };

    console.log("tx prepared:", tx);
    return tx;
  }, [accountRs, fetchRecipAccountId, publicKey, sendQuantity, toAddress]);

  const handleSend = useCallback(async () => {
    if (sendJUP !== undefined) {
      const unsignedTx = await prepareUnsignedTx();
      sendJUP(unsignedTx);
    }
  }, [prepareUnsignedTx, sendJUP]);

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
        <Grid xs={12} container>
          <Grid xs={10} container>
            <Grid item xs={12}>
              <StyledWidgetHeading>Send JUP</StyledWidgetHeading>
            </Grid>
            <Grid item xs={12}>
              <StyledAutocomplete
                freeSolo
                options={placeHolderVals.map((option) => option)}
                renderInput={(params) => <TextField {...params} label="Enter asset name" />}
              />
            </Grid>
            <Grid item xs={12}>
              <StyledToAddressInput onChange={(e) => handleToAddressEntry(e.target.value)} placeholder="To Address" />
            </Grid>
            <Grid item xs={12}>
              <StyledQuantityInput onChange={(e) => handleQuantityEntry(e.target.value)} placeholder="Quantity" />
            </Grid>
          </Grid>
          <Grid xs={2} container>
            <Grid item xs={12}>
              <StyledSendButton fullWidth onClick={handleSend} variant="contained">
                Send
              </StyledSendButton>
            </Grid>
          </Grid>
        </Grid>
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

const StyledWidgetHeading = styled(Typography)(() => ({
  textAlign: "center",
}));

const StyledAutocomplete = styled(Autocomplete)(() => ({
  minWidth: "250px",
  padding: "10px",
}));

const StyledToAddressInput = styled(Input)(() => ({
  minWidth: "550px",
  padding: "10px",
  margin: "10px",
}));

// TODO: find out how to fill width, still not 100% decided on this component's base
const StyledQuantityInput = styled(Input)(() => ({
  minWidth: "550px",
  padding: "10px",
  margin: "10px",
}));

// TODO: find out how to get the height to auto fill
const StyledSendButton = styled(Button)(() => ({
  margin: "10px",
  minHeight: "250px",
}));
export default memo(Dashboard);
