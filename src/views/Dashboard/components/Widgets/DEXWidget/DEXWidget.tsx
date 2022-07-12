import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Divider, Grid, Stack, styled, Typography } from "@mui/material";
import JUPAssetSearchBox from "components/JUPAssetSearchBox";
import JUPInput from "components/JUPInput";
import useAPI from "hooks/useAPI";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import useAPIRouter from "hooks/useAPIRouter";

const DEXWidget: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<number>();
  const [priceInput, setPriceInput] = useState<string>();
  const [quantityInput, setQuantityInput] = useState<string>();
  const [highestBid, setHighestBid] = useState<string>();
  const [lowestAsk, setLowestAsk] = useState<string>();
  const { getOrders } = useAPI();
  const { placeBidOrder } = useAPIRouter();

  const handleFetchPrice = useCallback((price: string | undefined) => {
    if (price === undefined) {
      return;
    }
    console.log("price input:", price);
    setPriceInput(price);
  }, []);

  const handleFetchQuantity = useCallback((qty: string | undefined) => {
    if (qty === undefined) {
      return;
    }
    console.log("qty input:", qty);
    setQuantityInput(qty);
  }, []);

  const handleFetchSelectedAsset = useCallback((asset: number) => {
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

  const handleSwap = useCallback(
    (orderType: "buy" | "sell") => {
      console.log("performing swap from handleSwap() in dexwidget...", orderType);

      if (placeBidOrder === undefined || selectedAsset === undefined || quantityInput === undefined || priceInput === undefined) {
        console.error("need to define appropriate inputs to perform a swap", placeBidOrder, selectedAsset, quantityInput, priceInput);
        return;
      }

      if (orderType === "buy") {
        placeBidOrder(selectedAsset, quantityInput, priceInput, "test");
      } else if (orderType === "sell") {
        console.log("not implemented yet...");
      }
    },
    [placeBidOrder, priceInput, quantityInput, selectedAsset]
  );

  // keeps bid/ask information updated as the user selects different assets from the dropdown
  useEffect(() => {
    console.log("asset changed to:", selectedAsset);

    handleGetOrders();
  }, [getOrders, handleGetOrders, selectedAsset]);

  const ConditionalOrderbookInfoMemo = useMemo(() => {
    return selectedAsset ? (
      <span style={{ marginLeft: "auto", marginRight: "auto" }}>
        <StyledBidAskText>Highest Bid: {highestBid}</StyledBidAskText>
        <StyledBidAskText>Lowest Ask: {lowestAsk}</StyledBidAskText>
      </span>
    ) : (
      <span style={{ marginLeft: "auto", marginRight: "auto" }}>
        <Typography>Please select an asset.</Typography>
      </span>
    );
  }, [highestBid, lowestAsk, selectedAsset]);

  return (
    <>
      <StyledWidgetHeading>Decentralized Exchange (DEX)</StyledWidgetHeading>

      <Grid container>
        <Grid item xs={10}>
          <Stack sx={{ width: "95%", margin: "0px 10px", padding: "10px" }}>
            <JUPAssetSearchBox fetchFn={(asset: number) => handleFetchSelectedAsset(asset)} />
            <StyledPriceInput inputType="price" fetchFn={(price) => handleFetchPrice(price)} placeholder="Price" />
            <StyledQuantityInput inputType="quantity" fetchFn={(quantity) => handleFetchQuantity(quantity)} placeholder="Quantity" />
            <StyledDivider />
            {ConditionalOrderbookInfoMemo}
          </Stack>
        </Grid>
        <Grid item xs={2}>
          <StyledSwapButton fullWidth onClick={() => handleSwap("buy")} variant="green">
            Buy
          </StyledSwapButton>
          <StyledSwapButton fullWidth onClick={() => handleSwap("sell")} variant="green">
            Sell
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
  height: "50%",
}));

export default memo(DEXWidget);
