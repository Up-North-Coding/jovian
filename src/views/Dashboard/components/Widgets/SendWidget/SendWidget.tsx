import React, { memo, useCallback, useMemo, useState } from "react";
import { Autocomplete, Box, Button, Dialog, FormGroup, Grid, Input, styled, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { IUnsignedTransaction } from "types/NXTAPI";
import { isValidAddress } from "utils/validation";
import useAccount from "hooks/useAccount";
import useAPI from "hooks/useAPI";

const placeHolderVals = ["JUP", "ASTRO"];

const JUPGenesisTimestamp = 1508627969; // can be found in getConstants() API call as "epochBeginning"

// TODO: implement as advanced features?
const standardFee = "5000";
const standardDeadline = 1440;

const SendWidget: React.FC = () => {
  const [toAddress, setToAddress] = useState<string>("");
  const [sendQuantity, setSendQuantity] = useState<string>();
  const [requestUserSecret, setRequestUserSecret] = useState<boolean>(false);
  const [userSecretInput, setUserSecretInput] = useState<string>("");
  const { accountRs, publicKey } = useAccount();
  const { sendJUP, getAccount, getAccountId } = useAPI();

  const fetchRecipAccountId = useCallback(async () => {
    if (getAccount !== undefined && getAccountId !== undefined) {
      try {
        const result = await getAccount(toAddress);
        if (result) {
          const accountResult = await getAccountId(result.publicKey);
          if (accountResult) {
            return accountResult.account;
          }
        }
      } catch (e) {
        console.error("error while fetching public key:", e);
        return;
      }
    }
  }, [getAccount, getAccountId, toAddress]);

  // need a final useEffect which gets run when all other pieces are ready to build the transaction
  const prepareUnsignedTx = useCallback(
    async (secret: string): Promise<IUnsignedTransaction | undefined> => {
      // make sure address is valid
      if (!isValidAddress(toAddress)) {
        return;
      }

      if (accountRs === undefined || sendQuantity === undefined) {
        return;
      }

      const recipientAccountId = await fetchRecipAccountId();
      const tx: IUnsignedTransaction = {
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
        timestamp: Math.round(Date.now() / 1000) - JUPGenesisTimestamp, // Seconds since Genesis. sets the origination time of the tx (since broadcast can happen later).
        secret: secret,
      };

      return tx;
    },
    [accountRs, fetchRecipAccountId, publicKey, sendQuantity, toAddress]
  );

  const handleSend = useCallback(async () => {
    if (sendJUP !== undefined) {
      setRequestUserSecret(true);
    }
  }, [sendJUP]);

  const handleSubmitSecret = useCallback(
    async (secret: string) => {
      const unsignedTx = await prepareUnsignedTx(secret);
      if (sendJUP !== undefined && unsignedTx !== undefined) {
        const result = await sendJUP(unsignedTx);
        console.log("send result:", result);
      }
    },
    [prepareUnsignedTx, sendJUP]
  );

  const handleToAddressEntry = useCallback(
    (toAddressInput: string) => {
      setToAddress(toAddressInput);
    },
    [setToAddress]
  );

  const handleQuantityEntry = useCallback((quantityInput: string) => {
    setSendQuantity(quantityInput);
  }, []);

  const handleSecretEntry = useCallback((secretInput) => {
    setUserSecretInput(secretInput);
  }, []);

  // MUST: currently the widget disappears when the dialog appears, it would be nice if it stayed in the background
  const ConditionalSendWidget = useMemo(() => {
    return requestUserSecret ? (
      <>
        <Dialog open={requestUserSecret}>
          <Box sx={{ minWidth: "600px", height: "300px" }}>
            <Typography align="center">Please enter your seed phrase.</Typography>
            {/* MUST: hide password during entry and provide a "show password" icon */}
            <Input onChange={(e) => handleSecretEntry(e.target.value)} placeholder="Enter Seed Phrase"></Input>
            <Button variant="contained" onClick={() => handleSubmitSecret(userSecretInput)}>
              Confirm & Send
            </Button>
            <Button variant="outlined" onClick={() => setRequestUserSecret(false)}>
              Cancel
            </Button>
          </Box>
        </Dialog>
      </>
    ) : (
      <Box sx={{ border: "1px dotted green", margin: "10px", height: "300px" }}>
        <FormGroup>
          <Grid container>
            <Grid container>
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
            <Grid container>
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
  }, [handleQuantityEntry, handleSecretEntry, handleSend, handleSubmitSecret, handleToAddressEntry, requestUserSecret, userSecretInput]);

  return <>{ConditionalSendWidget}</>;
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

export default memo(SendWidget);
