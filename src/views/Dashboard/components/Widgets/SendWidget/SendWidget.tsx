import React, { memo, useCallback, useMemo, useState } from "react";
import { Button, Checkbox, Grid, InputLabel, Stack, styled, Typography } from "@mui/material";
import useAPIRouter from "hooks/useAPIRouter";
import JUPInput from "components/JUPInput";

const SendWidget: React.FC = () => {
  const [toAddress, setToAddress] = useState<string>();
  const [sendQuantity, setSendQuantity] = useState<string>();
  const [isMessageIncluded, setIsMessageIncluded] = useState<boolean>(false);
  const { sendJUP } = useAPIRouter();

  const handleSend = useCallback(async () => {
    if (toAddress === undefined || sendJUP === undefined || sendQuantity === undefined) {
      return;
    }

    try {
      const result = await sendJUP(toAddress, sendQuantity, isMessageIncluded);
      console.log("sendWidget sendJUP result:", result);
    } catch (e) {
      console.error("error while sending JUP", e);
      return;
    }
  }, [isMessageIncluded, sendJUP, sendQuantity, toAddress]);

  const handleToAddressEntry = useCallback(
    (toAddressInput: string) => {
      setToAddress(toAddressInput);
    },
    [setToAddress]
  );

  const fetchToAddress = useCallback((address: string | undefined) => {
    if (address === undefined) {
      setToAddress(undefined);
      return;
    }
    setToAddress(address);
  }, []);

  const fetchQuantity = useCallback((quantity: string | undefined) => {
    if (quantity === undefined) {
      setSendQuantity(undefined);
      return;
    }
    setSendQuantity(quantity);
  }, []);

  const handleQuantityEntry = useCallback((quantityInput: string) => {
    setSendQuantity(quantityInput);
  }, []);

  const CheckboxMemo = useMemo(() => {
    return (
      <InputLabel>
        <Checkbox onClick={() => setIsMessageIncluded((prev) => !prev)} checked={isMessageIncluded} />
        Include A Message?
      </InputLabel>
    );
  }, [isMessageIncluded]);

  return (
    <div id="sendWidget">
      <StyledWidgetHeading>Send JUP</StyledWidgetHeading>

      <Grid container>
        <Grid item xs={12}>
          <Stack sx={{ width: "95%", margin: "10px", padding: "10px" }} spacing={2}>
            {/* removing search box for now, will eventually extend this widget to allow asset transfers */}
            {/* <JUPAssetSearchBox fetchFn={handleFetch} /> */}
            <StyledToAddressInput
              fetchInputValue={fetchToAddress}
              onChange={(e: React.SyntheticEvent) => handleToAddressEntry((e.currentTarget as HTMLInputElement).value)}
              placeholder="To Address"
              inputType="address"
            />
            <StyledQuantityInput
              inputType="quantity"
              fetchInputValue={fetchQuantity}
              onChange={(e: React.SyntheticEvent) => handleQuantityEntry((e.currentTarget as HTMLInputElement).value)}
              placeholder="Quantity"
            />
            {CheckboxMemo}
            <StyledSendButton fullWidth onClick={handleSend} variant="green">
              Send
            </StyledSendButton>
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
};

const StyledWidgetHeading = styled(Typography)(() => ({
  textAlign: "center",
}));

const StyledToAddressInput = styled(JUPInput, {
  shouldForwardProp: (prop) => prop !== "onChange",
})<{ onChange?: (e: React.SyntheticEvent) => void }>(() => ({
  width: "90%",
  padding: "10px",
  margin: "10px 10px",
}));

const StyledQuantityInput = styled(JUPInput, {
  shouldForwardProp: (prop) => prop !== "onChange",
})<{ onChange?: (e: React.SyntheticEvent) => void }>(() => ({
  width: "90%",
  padding: "10px",
  margin: "10px 10px",
}));

const StyledSendButton = styled(Button)(() => ({
  height: "80px",
}));

export default memo(SendWidget);
