import React, { memo, useCallback, useMemo, useState } from "react";
import { Autocomplete, Box, Button, DialogContent, Grid, Input, Stack, styled, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { IUnsignedTransaction } from "types/NXTAPI";
import { isValidAddress } from "utils/validation";
import { messageText } from "utils/common/messages";
import useAccount from "hooks/useAccount";
import useAPI from "hooks/useAPI";
import { JUPGenesisTimestamp, standardDeadline, standardFee } from "utils/common/constants";
import JUPDialog from "components/JUPDialog";
import { useSnackbar } from "notistack";

// [x]: Pagination
// MUST: Improve styling
// [x]: Shortcut to page

const placeHolderVals = ["JUP", "ASTRO"];

const SendWidget: React.FC = () => {
  const [toAddress, setToAddress] = useState<string>("");
  const [sendQuantity, setSendQuantity] = useState<string>();
  const [requestUserSecret, setRequestUserSecret] = useState<boolean>(false);
  const [userSecretInput, setUserSecretInput] = useState<string>("");
  const { accountRs, publicKey } = useAccount();
  const { sendJUP, getAccount, getAccountId } = useAPI();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleCloseSeedCollection = useCallback(() => {
    setRequestUserSecret(false);
    enqueueSnackbar(messageText.transaction.cancel, { variant: "warning" });
  }, [enqueueSnackbar]);

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
        amountNQT: sendQuantity, // TODO: use converter function, but for now it's nice for cheaper testing
        recipientRS: toAddress,
        recipient: recipientAccountId,
        ecBlockHeight: 0, // must be included
        deadline: standardDeadline,
        timestamp: Math.round(Date.now() / 1000) - JUPGenesisTimestamp, // Seconds since Genesis. sets the origination time of the tx (since broadcast can happen later).
        secretPhrase: secret,
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
        if (result) {
          enqueueSnackbar(messageText.transaction.success, { variant: "success" });
          return;
        }
        enqueueSnackbar(messageText.transaction.failure, { variant: "error" });
        console.log("send result:", result);
      }
    },
    [enqueueSnackbar, prepareUnsignedTx, sendJUP]
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

  const ConditionalSendWidget = useMemo(() => {
    return (
      requestUserSecret && (
        <>
          <JUPDialog isOpen={requestUserSecret} closeFn={handleCloseSeedCollection}>
            <DialogContent>
              <Box sx={{ minWidth: "600px", height: "300px" }}>
                <Typography align="center">Please enter your seed phrase.</Typography>
                <Stack sx={{ alignItems: "center" }}>
                  <SeedphraseEntryBox onChange={(e) => handleSecretEntry(e.target.value)} type="password" placeholder="Enter Seed Phrase" />
                  <ConfirmButton variant="contained" onClick={() => handleSubmitSecret(userSecretInput)}>
                    Confirm & Send
                  </ConfirmButton>
                </Stack>
              </Box>
            </DialogContent>
          </JUPDialog>
        </>
      )
    );
  }, [handleCloseSeedCollection, handleSecretEntry, handleSubmitSecret, requestUserSecret, userSecretInput]);

  return (
    <>
      {ConditionalSendWidget}
      <>
        <StyledWidgetHeading>Send JUP</StyledWidgetHeading>

        <Grid container>
          <Grid item xs={10}>
            <StyledAutocomplete
              freeSolo
              options={placeHolderVals.map((option) => option)}
              renderInput={(params) => <TextField {...params} label="Enter asset name" />}
            />
            <StyledToAddressInput onChange={(e) => handleToAddressEntry(e.target.value)} placeholder="To Address" />
            <StyledQuantityInput onChange={(e) => handleQuantityEntry(e.target.value)} placeholder="Quantity" />
          </Grid>
          <Grid item xs={2}>
            <StyledSendButton fullWidth onClick={handleSend} variant="contained">
              Send
            </StyledSendButton>
          </Grid>
        </Grid>
      </>
    </>
  );
};

const SeedphraseEntryBox = styled(Input)(({ theme }) => ({
  minWidth: "400px",
  margin: "40px 0px",
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
  margin: "20px 0px",
}));

const StyledWidgetHeading = styled(Typography)(() => ({
  textAlign: "center",
}));

const StyledAutocomplete = styled(Autocomplete)(() => ({
  width: "90%",
  padding: "10px",
  margin: "0px 10px",
}));

const StyledToAddressInput = styled(Input)(() => ({
  width: "90%",
  padding: "10px",
  margin: "10px 10px",
}));

const StyledQuantityInput = styled(Input)(() => ({
  width: "90%",
  padding: "10px",
  margin: "10px 10px",
}));

const StyledSendButton = styled(Button)(() => ({
  height: "100%",
}));

export default memo(SendWidget);
