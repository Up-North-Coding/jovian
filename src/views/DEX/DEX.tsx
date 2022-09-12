import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import Page from "components/Page";
import Drawer from "../../components/Drawer";
import useBreakpoint from "hooks/useBreakpoint";
import WidgetContainer from "views/Dashboard/components/WidgetContainer";
import JUPAppBar from "components/JUPAppBar";
import { Box, Button, Grid, IconButton, Link, Stack, Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Typography } from "@mui/material";
import JUPInput from "components/JUPInput";
import { CSSProperties } from "@mui/styled-engine";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { defaultAssetList } from "utils/common/defaultAssets";
import useAPI from "hooks/useAPI";
import { IAsset, IGetOrdersResult, IGetTradesResult, ITrade } from "types/NXTAPI";
import useBlocks from "hooks/useBlocks";
import { placeOrder } from "utils/api/placeOrder";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import { LongUnitPrecision } from "utils/common/constants";

const PLACEHOLDERS = {
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

const orderTableColumns = ["Date", "Type", "Quantity", "Price", "Total", "Buyer", "Seller"];

interface IOrderTableProps {
  assetId?: string;
}

const OrderTable: React.FC<IOrderTableProps> = ({ assetId }) => {
  const [tradeHistory, setTradeHistory] = useState<IGetTradesResult>();
  const { getOrders, getTrades } = useAPI();
  const { blockHeight } = useBlocks();

  // set the trade history for the current asset
  useEffect(() => {
    async function fetchTrades() {
      if (getTrades === undefined || assetId === undefined) {
        return;
      }

      try {
        const result = await getTrades(assetId);

        if (result) {
          setTradeHistory(result);
        }
      } catch (e) {
        console.error("error while getting trade history in DEX component:", e);
        return;
      }
    }

    fetchTrades();
  }, [assetId, blockHeight, getTrades]);

  const HeadCellsMemo = useMemo(() => {
    return orderTableColumns.map((column, index) => {
      return (
        <TableCell key={`th-${column}-${index}`}>
          <Typography>{column}</Typography>
        </TableCell>
      );
    });
  }, []);

  const RowDataMemo = useMemo(() => {
    return tradeHistory?.trades.map((trade: ITrade) => {
      return (
        <TableRow key={`tr-${trade.timestamp}-${trade.height}`}>
          <TableCell>{trade.timestamp}</TableCell>
          <TableCell>{trade.tradeType}</TableCell>
          <TableCell>{trade.quantityQNT}</TableCell>
          <TableCell>{trade.priceNQT}</TableCell>
          <TableCell>{"total"}</TableCell>
          <TableCell>{trade.buyerRS}</TableCell>
          <TableCell>{trade.sellerRS}</TableCell>
        </TableRow>
      );
    });
  }, [tradeHistory]);

  return (
    <Table sx={{ border: "1px solid white" }}>
      <TableHead>{HeadCellsMemo}</TableHead>
      <TableBody>{RowDataMemo}</TableBody>
    </Table>
  );
};

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
        <OrderTable assetId={assetId} />
      </TabPanel>
      <TabPanel value={tabId} index={1}>
        <OrderTable assetId={assetId} />
      </TabPanel>
      <TabPanel value={tabId} index={2}>
        <OrderTable assetId={assetId} />
      </TabPanel>
    </>
  );
};

interface IOrderbookProps {
  assetId?: string;
}

const OrderBook: React.FC<IOrderbookProps> = ({ assetId }) => {
  const { getOrders, getTrades } = useAPI();
  const { blockHeight } = useBlocks();
  const [openOrders, setOpenOrders] = useState<IGetOrdersResult>();

  const bidOrderbookStyling: CSSProperties = {
    border: "2px solid green",
    height: "100%",
  };

  const askOrderbookStyling: CSSProperties = {
    border: "2px solid red",
    height: "100%",
  };

  // maps both bid and ask orders
  const RowsMemo = useMemo(() => {
    if (openOrders === undefined) {
      return;
    }

    const mappedAskOrders = openOrders?.asks.map((order, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{NQTtoNXT(order.priceNQT).toFixed(LongUnitPrecision)}</TableCell>
          <TableCell>{order.quantityQNT}</TableCell>
        </TableRow>
      );
    });

    const mappedBidOrders = openOrders?.bids.map((order, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{NQTtoNXT(order.priceNQT).toFixed(LongUnitPrecision)}</TableCell>
          <TableCell>{order.quantityQNT}</TableCell>
        </TableRow>
      );
    });

    return { asks: mappedAskOrders, bids: mappedBidOrders };
  }, [openOrders]);

  // set the orders for the current asset
  useEffect(() => {
    async function fetchOrders() {
      if (getOrders === undefined || assetId === undefined) {
        return;
      }

      try {
        const result = await getOrders(assetId);

        if (result) {
          setOpenOrders(result);
        }
      } catch (e) {
        console.error("error while getting orders in DEX component:", e);
        return;
      }
    }

    fetchOrders();
  }, [assetId, blockHeight, getOrders]);

  return (
    <>
      <Table sx={askOrderbookStyling} size="small" padding="none">
        <TableHead>
          <TableCell>
            <Typography>Price</Typography>
          </TableCell>
          <TableCell>
            <Typography>Quantity</Typography>
          </TableCell>
        </TableHead>
        <TableBody>{RowsMemo?.asks}</TableBody>
      </Table>

      <Typography>Last Price: {PLACEHOLDERS.lastPrice}</Typography>

      <Table sx={bidOrderbookStyling} size="small" padding="none">
        <TableHead>
          <TableCell>
            <Typography>Price</Typography>
          </TableCell>
          <TableCell>
            <Typography>Quantity</Typography>
          </TableCell>
        </TableHead>
        <TableBody>{RowsMemo?.bids}</TableBody>
      </Table>
    </>
  );
};

const DEX: React.FC = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(true);
  const isMobileMedium = useBreakpoint("<", "md");
  const [assetDetails, setAssetDetails] = useState<IAsset>();

  const { getAsset } = useAPI();

  const handleDrawerToggle = useCallback(() => {
    setDrawerIsOpen((prev: boolean) => !prev);
  }, []);

  const getSelectedSymbol = useCallback(
    async (symbol: string | undefined) => {
      console.log("current symbol:", symbol);

      if (symbol === undefined || getAsset === undefined) {
        return;
      }

      let assetResult;
      try {
        assetResult = await getAsset(symbol);
        console.log("got assetResult:", assetResult);
        if (!assetResult) {
          return;
        }
        setAssetDetails(assetResult);
      } catch (e) {
        console.error("error while getting asset in DEX:", e);
        return;
      }
    },
    [getAsset]
  );

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

  // sets the drawer state when the mobile breakpoint is hit
  useEffect(() => {
    if (isMobileMedium) {
      setDrawerIsOpen(false);
      return;
    }
    setDrawerIsOpen(true);
  }, [isMobileMedium]);

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
              height="300px"
              justifyContent="center"
            >
              {/* One input needs to be locked to JUP & the other needs to be selectable */}
              <JUPInput
                inputType="symbol"
                placeholder={"Enter Quantity"}
                fetchFn={(symbol) => getSelectedSymbol(symbol)}
                symbols={defaultAssetList.map((asset) => asset.name)}
              ></JUPInput>
              <IconButton sx={{ width: "50px", alignSelf: "center" }}>
                <SwapVertIcon />
              </IconButton>
              <JUPInput
                inputType="symbol"
                placeholder={"Enter Quantity"}
                fetchFn={(symbol) => getSelectedSymbol(symbol)}
                symbols={["JUP"]}
              ></JUPInput>
              <Button sx={{ height: "80px" }} variant="green">
                SWAP
              </Button>
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
              justifyContent="center"
            >
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
