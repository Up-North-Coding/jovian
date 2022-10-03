import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Divider, Grid, Stack, styled, Typography } from "@mui/material";
import { BigNumber } from "bignumber.js";
import JUPAssetSearchBox from "components/JUPAssetSearchBox";
import JUPInput from "components/JUPInput";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import { NXTtoNQT } from "utils/common/NXTtoNQT";
import { isAdequateDepth } from "utils/common/orderDepthCalculations";
import { messageText } from "utils/common/messages";
import { LongUnitPrecision } from "utils/common/constants";
import useAPIRouter from "hooks/useAPIRouter";
import useAPI from "hooks/useAPI";
import { IOpenOrder } from "types/NXTAPI";
import { useSnackbar } from "notistack";

const DEXWidget: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>();
  const [priceInput, setPriceInput] = useState<BigNumber>();
  const [quantityInput, setQuantityInput] = useState<BigNumber>();
  const [highestBid, setHighestBid] = useState<BigNumber>();
  const [lowestAsk, setLowestAsk] = useState<BigNumber>();
  const [bidOrderBook, setBidOrderBook] = useState<Array<IOpenOrder>>();
  const [askOrderBook, setAskOrderBook] = useState<Array<IOpenOrder>>();
  const { getOrders } = useAPI();
  const { placeOrder } = useAPIRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleFetchPrice = useCallback((price: string | undefined) => {
    if (price === undefined) {
      return;
    }
    setPriceInput(new BigNumber(price));
  }, []);

  const handleFetchQuantity = useCallback((qty: string | undefined) => {
    if (qty === undefined) {
      return;
    }
    setQuantityInput(new BigNumber(qty));
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
      // console.log("got orders:", result);
    } catch (e) {
      console.error("error getting orders in DEXWidget", e);
      return;
    }

    if (result && result.bids.length > 0) {
      setHighestBid(NQTtoNXT(result.bids[0].priceNQT));
      setBidOrderBook(result.bids);
    }

    if (result && result.asks.length > 0) {
      setLowestAsk(NQTtoNXT(result.asks[0].priceNQT));
      setAskOrderBook(result.asks);
    }
  }, [getOrders, selectedAsset]);

  const handleSwap = useCallback(
    async (orderType: "buy" | "sell") => {
      if (placeOrder === undefined || selectedAsset === undefined || quantityInput === undefined || priceInput === undefined) {
        console.error("need to define appropriate inputs to perform a swap", placeOrder, selectedAsset, quantityInput, priceInput);
        return;
      }

      if (bidOrderBook === undefined || askOrderBook === undefined) {
        console.error("bidOrderBook or askOrderBook is undefined, returning early...");
        return;
      }

      let isAdequateDepthForOrderSize: boolean;

      if (orderType === "buy") {
        // if there's no orders in the book, there's no need to run the depth checker
        isAdequateDepthForOrderSize = askOrderBook ? await isAdequateDepth(quantityInput, askOrderBook) : false;

        // supply the user with some feedback about whether their order will execute fully
        isAdequateDepthForOrderSize
          ? enqueueSnackbar(messageText.orders.sufficientDepth, { variant: "success" })
          : enqueueSnackbar(messageText.orders.lowDepth, { variant: "warning" });
        placeOrder("bid", selectedAsset, quantityInput, NXTtoNQT(priceInput));
      } else if (orderType === "sell") {
        // if there's no orders in the book, there's no need to run the depth checker
        isAdequateDepthForOrderSize = bidOrderBook ? await isAdequateDepth(quantityInput, askOrderBook) : false;

        placeOrder("ask", selectedAsset, quantityInput, NXTtoNQT(priceInput));
      }
    },
    [askOrderBook, bidOrderBook, enqueueSnackbar, placeOrder, priceInput, quantityInput, selectedAsset]
  );

  // keeps bid/ask information updated as the user selects different assets from the dropdown
  useEffect(() => {
    handleGetOrders();
  }, [getOrders, handleGetOrders, selectedAsset]);

  // provides information to the user about the highest bid price and lowest ask price
  // of the selected asset
  const ConditionalOrderbookInfoMemo = useMemo(() => {
    return selectedAsset ? (
      <span style={{ marginLeft: "auto", marginRight: "auto" }}>
        <StyledBidAskText>Highest Bid: {highestBid?.toFixed(LongUnitPrecision)}</StyledBidAskText>
        <StyledBidAskText>Lowest Ask: {lowestAsk?.toFixed(LongUnitPrecision)}</StyledBidAskText>
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
          <Stack sx={{ width: "95%", margin: "0px 10px", padding: "10px" }} spacing={2}>
            <JUPAssetSearchBox fetchFn={(asset: string) => handleFetchSelectedAsset(asset)} />
            <StyledPriceInput inputType="price" fetchInputValue={(price) => handleFetchPrice(price)} placeholder="Price" />
            <StyledQuantityInput inputType="quantity" fetchInputValue={(quantity) => handleFetchQuantity(quantity)} placeholder="Quantity" />
            <StyledDivider />
            {ConditionalOrderbookInfoMemo}
          </Stack>
        </Grid>
        <Grid item xs={2}>
          <ButtonGroup orientation="vertical" sx={{ height: "100%" }}>
            <StyledSwapButton fullWidth onClick={() => handleSwap("buy")} variant="green">
              Buy
            </StyledSwapButton>
            <StyledSwapButton fullWidth onClick={() => handleSwap("sell")} variant="red">
              Sell
            </StyledSwapButton>
          </ButtonGroup>
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
