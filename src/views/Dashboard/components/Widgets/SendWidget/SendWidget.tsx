import React, { memo, useCallback, useMemo, useState } from "react";
import { Autocomplete, Box, Button, DialogContent, Grid, Input, Stack, styled, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { messageText } from "utils/common/messages";
import JUPDialog from "components/JUPDialog";
import { useSnackbar } from "notistack";
import useAPIRouter from "hooks/useAPIRouter";

// [x]: Pagination
// MUST: Improve styling
// [x]: Shortcut to page

const placeHolderVals = ["JUP", "ASTRO"];

const SendWidget: React.FC = () => {
  const [toAddress, setToAddress] = useState<string>("");
  const [sendQuantity, setSendQuantity] = useState<string>();
  const { sendJUP } = useAPIRouter();

  const handleSend = useCallback(async () => {
    if (sendJUP === undefined || sendQuantity === undefined || toAddress === "") {
      return;
    }

    const result = await sendJUP(toAddress, sendQuantity);

    console.log("sendWidget sendJUP result:", result);
  }, [sendJUP, sendQuantity, toAddress]);

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
