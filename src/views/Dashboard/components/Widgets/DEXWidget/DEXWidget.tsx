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
          <Stack sx={{ width: "90%", margin: "0px 10px", padding: "10px" }}>
            <JUPAssetSearchBox fetchFn={(asset: string) => handleFetchSelectedAsset(asset)} />
            <StyledPriceInput inputType="price" fetchFn={(price) => handleFetchPrice(price)} placeholder="Price" />
            <StyledQuantityInput inputType="quantity" fetchFn={(quantity) => handleFetchPrice(quantity)} placeholder="Quantity" />
            <StyledDivider />
            <span style={{ marginLeft: "auto", marginRight: "auto" }}>
              <StyledBidAskText>Highest Bid: {highestBid}</StyledBidAskText>
              <StyledBidAskText>Lowest Ask: {lowestAsk}</StyledBidAskText>
            </span>
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

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const StyledBidAskText = styled(Typography)(() => ({
  width: "50%",
  padding: "10px 10px",
  display: "inline-block",
  whiteSpace: "nowrap",
}));

const StyledPriceInput = styled(JUPInput)(() => ({
  width: "90%",
  padding: "10px",
  margin: "10px 10px",
}));

const StyledQuantityInput = styled(JUPInput)(() => ({
  width: "90%",
  padding: "10px",
  margin: "10px 10px",
}));

const StyledSwapButton = styled(Button)(() => ({
  height: "100%",
}));

export default memo(DEXWidget);
