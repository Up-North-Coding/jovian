import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import Page from "components/Page";
import Drawer from "../../components/Drawer";
import useBreakpoint from "hooks/useBreakpoint";
import WidgetContainer from "views/Dashboard/components/WidgetContainer";
import JUPAppBar from "components/JUPAppBar";
import { Box, Button, Grid, Icon, IconButton, Link, Stack, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import JUPInput from "components/JUPInput";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { defaultAssetList } from "utils/common/defaultAssets";
import useAPI from "hooks/useAPI";
import { IAsset } from "types/NXTAPI";
import OverallOrderHistory from "./components/OverallOrderHistory";
import MyOrderHistory from "./components/MyOrderHistory";
import OrderBook from "./components/OrderBook";
import MyOpenOrders from "./components/MyOpenOrders";
import InfoIcon from "@mui/icons-material/Info";

// TODO:
//  [ ] Flip trade direction needs to switch symbols
//  [x] One side of trade always needs to stay "JUP"
//  [ ] Paginate swaps tables

export const PLACEHOLDERS = {
  circulatingSupply: "123,345",
  decimals: "8",
  description:
    "Bacon ipsum dolor amet pork loin ground round cow ham turducken, shank andouille jowl short ribs landjaeger sirloin swine beef chicken. Tail jowl ribeye pastrami landjaeger. Kevin turkey andouille ribeye fatback. Cupim meatball tail strip steak, beef ribs sirloin kevin short ribs tri-tip corned beef spare ribs. Flank cow ground round ham hock ribeye short ribs pastrami pork belly.",
  lastPrice: "1.00539",

  orders: {
    bidOrders: [
      {
        price: "1.00003",
        qty: "1000",
      },
      {
        price: "1.004",
        qty: "23",
      },
      {
        price: "1.12",
        qty: "7000",
      },
      {
        price: "1.19",
        qty: "50",
      },
      {
        price: "1.21",
        qty: "52.349203948",
      },
    ],
    askOrders: [
      {
        price: "1.15",
        qty: "123.4909283",
      },
      {
        price: "1.39",
        qty: "2203",
      },
      {
        price: "1.90",
        qty: "0.1239901",
      },
      {
        price: "1.99",
        qty: "81.239019",
      },
      {
        price: "2.10",
        qty: "5.1",
      },
    ],
  },
};

interface ITabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<ITabPanelProps> = ({ index, value, children, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const orderTableColumns = ["Date", "Type", "Quantity", "Price", "Total", "Buyer", "Seller"];

interface IOrderHistoryProps {
  assetId?: string;
}

const OrderHistory: React.FC<IOrderHistoryProps> = ({ assetId }) => {
  const [tabId, setCurrentTabId] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTabId(newValue);
  };

  return (
    <>
      {/* Tabs themselves */}
      <Tabs value={tabId} centered onChange={handleTabChange} aria-label="Detailed overview for block">
        <Tab label="Swap History" {...tabPropsById(0)} />
        <Tab label="Open Swaps" {...tabPropsById(1)} />
        <Tab label="My Swaps" {...tabPropsById(2)} />
      </Tabs>

      {/* Tab contents */}
      <TabPanel value={tabId} index={0}>
        <OverallOrderHistory assetId={assetId} />
      </TabPanel>
      <TabPanel value={tabId} index={1}>
        <MyOpenOrders assetId={assetId}></MyOpenOrders>
      </TabPanel>
      <TabPanel value={tabId} index={2}>
        <MyOrderHistory assetId={assetId}></MyOrderHistory>
      </TabPanel>
    </>
  );
};

const DEX: React.FC = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(true);
  const isMobileMedium = useBreakpoint("<", "md");
  const [assetDetails, setAssetDetails] = useState<IAsset>();
  const [swapType, setSwapType] = useState<"buy" | "sell">("buy");
  const [selectedSymbol, setSelectedSymbol] = useState<string>();
  const { getAsset } = useAPI();

  const handleDrawerToggle = useCallback(() => {
    setDrawerIsOpen((prev: boolean) => !prev);
  }, []);

  const getSelectedSymbol = useCallback(
    async (symbol: string | undefined) => {
      if (symbol === undefined || getAsset === undefined) {
        return;
      }

      let assetResult;
      try {
        assetResult = await getAsset(symbol);
        if (!assetResult) {
          return;
        }
        setAssetDetails(assetResult);
        setSelectedSymbol(assetResult.name);
      } catch (e) {
        console.error("error while getting asset in DEX:", e);
        return;
      }
    },
    [getAsset]
  );

  const getInputQuantity = useCallback((inputVal: string | undefined) => {
    console.log("input quantity:", inputVal);
  }, []);

  const handleSwitchDirection = useCallback(() => {
    setSwapType(swapType === "buy" ? "sell" : "buy");
  }, [swapType]);

  const AssetDetailsMemo = useMemo(() => {
    if (assetDetails === undefined) {
      return <Typography>Please select an Asset from the middle swap panel.</Typography>;
    }

    return (
      <>
        <Typography>Name: {assetDetails?.name}</Typography>
        <Typography>Asset ID: {assetDetails?.asset}</Typography>
        <Typography>
          Circulating: {assetDetails?.quantityQNT} {assetDetails?.name}
        </Typography>
        <Typography>Decimals: {assetDetails?.decimals}</Typography>
        <Link>Show Distribution</Link>
        <Typography>Description: {assetDetails?.description}</Typography>
      </>
    );
  }, [assetDetails]);

  const SwapperMemo = useMemo(() => {
    return (
      <>
        <JUPInput
          inputType={swapType === "buy" ? "symbol" : "fixed"}
          placeholder={"Enter Quantity"}
          fetchAdornmentValue={(symbol) => getSelectedSymbol(symbol)}
          fetchValue={(symbol) => getInputQuantity(symbol)}
          symbols={swapType === "buy" ? defaultAssetList.map((asset) => asset.name) : undefined}
        ></JUPInput>
        <IconButton sx={{ width: "50px", alignSelf: "center" }} onClick={() => handleSwitchDirection()}>
          <SwapVertIcon />
        </IconButton>
        <JUPInput
          inputType={swapType === "buy" ? "fixed" : "symbol"}
          placeholder={"Enter Quantity"}
          fetchAdornmentValue={(symbol) => getSelectedSymbol(symbol)}
          fetchValue={(symbol) => getInputQuantity(symbol)}
          symbols={swapType === "sell" ? defaultAssetList.map((asset) => asset.name) : undefined}
        ></JUPInput>
        <Button sx={{ height: "80px" }} variant="green">
          SWAP
        </Button>
        <Typography>
          Swap {"quantity"} {selectedSymbol} for {"quantity 2"} {"JUP"}
        </Typography>
      </>
    );
  }, [getInputQuantity, getSelectedSymbol, handleSwitchDirection, selectedSymbol, swapType]);

  // sets the drawer state when the mobile breakpoint is hit
  useEffect(() => {
    if (isMobileMedium) {
      setDrawerIsOpen(false);
      return;
    }
    setDrawerIsOpen(true);
  }, [isMobileMedium]);

  useEffect(() => {
    console.log("selected Symbol: ", selectedSymbol);
  }, [selectedSymbol]);

  return (
    <Page>
      <Drawer isSidebarExpanded={drawerIsOpen} />
      <JUPAppBar isSidebarExpanded={drawerIsOpen} toggleFn={handleDrawerToggle} />
      <WidgetContainer isSidebarExpanded={drawerIsOpen}>
        <Grid container spacing={2} alignItems="center">
          {/* Asset Details */}
          <Grid item xs={4}>
            <Stack
              border="1px solid green"
              borderRadius="20px"
              direction="column"
              spacing={2}
              margin="5px"
              padding="15px"
              height="400px"
              justifyContent="center"
            >
              <Typography alignSelf={"center"}>Asset Details</Typography>
              {AssetDetailsMemo}
            </Stack>
          </Grid>

          {/* Swapper */}
          <Grid item xs={4}>
            <Stack
              border="1px solid green"
              borderRadius="20px"
              direction="column"
              spacing={2}
              margin="5px"
              padding="15px"
              height="350px"
              justifyContent="center"
            >
              <Icon>
                <Tooltip title="Currently only JUP -> Asset swaps are available, not Asset -> Asset directly.">
                  <InfoIcon />
                </Tooltip>
              </Icon>
              {/* One input needs to be locked to JUP & the other needs to be selectable */}
              {SwapperMemo}
            </Stack>
          </Grid>

          {/* Order Books */}
          <Grid item xs={4}>
            <Stack
              border="1px solid green"
              borderRadius="20px"
              direction="column"
              spacing={2}
              margin="5px"
              padding="15px"
              maxHeight="400px"
              minHeight="350px"
              justifyContent="center"
            >
              <Typography alignSelf={"center"}>Orderbook</Typography>
              <OrderBook assetId={assetDetails?.asset}></OrderBook>
            </Stack>
          </Grid>

          <Grid item xs={12} border="1px solid green" borderRadius="20px">
            <OrderHistory assetId={assetDetails?.asset} />
          </Grid>
        </Grid>
      </WidgetContainer>
    </Page>
  );
};

function tabPropsById(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default memo(DEX);
