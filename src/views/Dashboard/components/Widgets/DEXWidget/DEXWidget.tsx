import React, { memo, useCallback, useEffect, useState } from "react";
import { Button, Divider, Grid, Stack, styled, Typography } from "@mui/material";
import JUPAssetSearchBox from "components/JUPAssetSearchBox";
import JUPInput from "components/JUPInput";
import useAPI from "hooks/useAPI";
import { NQTtoNXT } from "utils/common/NQTtoNXT";

const DEXWidget: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>();
  const [highestBid, setHighestBid] = useState<string>();
  const [lowestAsk, setLowestAsk] = useState<string>();
  const { getOrders } = useAPI();

  const handleFetchPrice = useCallback((price: string | undefined) => {
    if (price === undefined) {
      return;
    }
    console.log("input:", price);
  }, []);

  const handleFetchSelectedAsset = useCallback((asset: string) => {
    setSelectedAsset(asset);
  }, []);

  const handleGetOrders = useCallback(async () => {
    if (getOrders === undefined || selectedAsset === undefined) {
      return;
    }

    let result;
    try {
      result = await getOrders(selectedAsset);
      console.log("got orders:", result);
    } catch (e) {
      console.error("error getting orders in DEXWidget", e);
      return;
    }

    if (result && result.bids.length > 0) {
      setHighestBid(NQTtoNXT(parseInt(result.bids[0].priceNQT)).toString());
    }

    if (result && result.asks.length > 0) {
      setLowestAsk(NQTtoNXT(parseInt(result.asks[0].priceNQT)).toString());
    }
  }, [getOrders, selectedAsset]);

  // keeps bid/ask information updated as the user selects different assets from the dropdown
  useEffect(() => {
    console.log("asset changed to:", selectedAsset);

    handleGetOrders();
  }, [getOrders, handleGetOrders, selectedAsset]);

  return (
    <>
      <StyledWidgetHeading>Decentralized Exchange (DEX)</StyledWidgetHeading>

      <Grid container>
        <Grid item xs={10}>
          <JUPAssetSearchBox fetchFn={(asset: string) => handleFetchSelectedAsset(asset)} />
          <Stack spacing={2}>
            <JUPInput inputType="price" fetchFn={(price) => handleFetchPrice(price)} placeholder="Price"></JUPInput>
            <JUPInput inputType="quantity" fetchFn={(quantity) => handleFetchPrice(quantity)} placeholder="Quantity"></JUPInput>
            <Divider />
          </Stack>
          <StyledBidAskText>Highest Bid: {highestBid}</StyledBidAskText>
          <StyledBidAskText>Lowest Ask: {lowestAsk}</StyledBidAskText>
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

const StyledBidAskText = styled(Typography)(() => ({
  padding: "10px 10px",
  display: "inline-block",
}));

const StyledSwapButton = styled(Button)(() => ({
  height: "100%",
}));

export default memo(DEXWidget);
