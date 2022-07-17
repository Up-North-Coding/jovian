import React, { memo, useCallback, useState } from "react";
import { Button, Grid, Stack, styled, Typography } from "@mui/material";
import useAPIRouter from "hooks/useAPIRouter";
import JUPAssetSearchBox from "components/JUPAssetSearchBox";
import JUPInput from "components/JUPInput";

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

  const handleFetch = useCallback(() => {
    console.log("fetch not implemented in sendWidget");
  }, []);

  return (
    <>
      <StyledWidgetHeading>Send JUP</StyledWidgetHeading>

      <Grid container>
        <Grid item xs={12}>
          <Stack sx={{ width: "95%", margin: "10px", padding: "10px" }}>
            {/* removing search box for now, will eventually extend this widget to allow asset transfers */}
            {/* <JUPAssetSearchBox fetchFn={handleFetch} /> */}
            <StyledToAddressInput
              fetchFn={handleFetch}
              onChange={(e) => handleToAddressEntry(e.target.value)}
              placeholder="To Address"
              inputType="address"
            />
            <StyledQuantityInput
              inputType="quantity"
              fetchFn={handleFetch}
              onChange={(e) => handleQuantityEntry(e.target.value)}
              placeholder="Quantity"
            />
          </Stack>
        </Grid>
        <Grid sx={{ width: "95%", margin: "10px", padding: "10px" }} item xs={12}>
          <StyledSendButton fullWidth onClick={handleSend} variant="green">
            Send
          </StyledSendButton>
        </Grid>
      </Grid>
    </>
  );
};

const StyledWidgetHeading = styled(Typography)(() => ({
  textAlign: "center",
}));

const StyledToAddressInput = styled(JUPInput, {
  shouldForwardProp: (prop) => prop !== "onChange",
})<{ onChange?: (e: any) => void }>(({ onChange }) => ({
  width: "90%",
  padding: "10px",
  margin: "10px 10px",
}));

const StyledQuantityInput = styled(JUPInput, {
  shouldForwardProp: (prop) => prop !== "onChange",
})<{ onChange?: (e: any) => void }>(({ onChange }) => ({
  width: "90%",
  padding: "10px",
  margin: "10px 10px",
}));

const StyledSendButton = styled(Button)(() => ({
  height: "80px",
}));

export default memo(SendWidget);
