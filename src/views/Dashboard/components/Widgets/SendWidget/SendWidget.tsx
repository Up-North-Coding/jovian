import React, { memo, useCallback, useState } from "react";
import { Button, Grid, Input, styled, Typography } from "@mui/material";
import useAPIRouter from "hooks/useAPIRouter";
import JUPAssetSearchBox from "components/JUPAssetSearchBox";

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
          <JUPAssetSearchBox />
          <StyledToAddressInput onChange={(e) => handleToAddressEntry(e.target.value)} placeholder="To Address" />
          <StyledQuantityInput onChange={(e) => handleQuantityEntry(e.target.value)} placeholder="Quantity" />
        </Grid>
        <Grid item xs={2}>
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
