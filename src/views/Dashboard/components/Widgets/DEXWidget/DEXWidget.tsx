import React, { memo, useCallback } from "react";
import { Button, Grid, Stack, styled, Typography } from "@mui/material";
import JUPAssetSearchBox from "components/JUPAssetSearchBox";
import JUPInput from "components/JUPInput";

const DEXWidget: React.FC = () => {
  const handleFetchPrice = useCallback((price: string | undefined) => {
    if (price === undefined) {
      return;
    }
    console.log("input:", price);
  }, []);

  return (
    <>
      <StyledWidgetHeading>Decentralized Exchange (DEX)</StyledWidgetHeading>

      <Grid container>
        <Grid item xs={10}>
          <JUPAssetSearchBox />
          <Stack spacing={2}>
            <JUPInput inputType="price" fetchFn={(price) => handleFetchPrice(price)} placeholder="Price"></JUPInput>
            <JUPInput inputType="quantity" fetchFn={(quantity) => handleFetchPrice(quantity)} placeholder="Quantity"></JUPInput>
          </Stack>
        </Grid>
        <Grid item xs={2}>
          <StyledSwapButton fullWidth onClick={() => console.log("need to implement...")} variant="green">
            Swap
          </StyledSwapButton>
        </Grid>
      </Grid>
    </>
  );
};

const StyledWidgetHeading = styled(Typography)(() => ({
  textAlign: "center",
}));

const StyledSwapButton = styled(Button)(() => ({
  height: "100%",
}));

export default memo(DEXWidget);
