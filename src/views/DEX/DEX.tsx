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

const OrderTable: React.FC = () => {
  const HeadCellsMemo = useMemo(() => {
    return orderTableColumns.map((column, index) => {
      return (
        <TableCell key={`th-${column}-${index}`}>
          <Typography>{column}</Typography>
        </TableCell>
      );
    });
  }, []);

  return (
    <Table sx={{ border: "1px solid white" }}>
      <TableHead>{HeadCellsMemo}</TableHead>
      <TableBody>
        <TableRow>
          <TableCell colSpan={orderTableColumns.length} align="center">
            Test
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const OrderHistory: React.FC = () => {
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
        <OrderTable />
      </TabPanel>
      <TabPanel value={tabId} index={1}>
        <OrderTable />
      </TabPanel>
      <TabPanel value={tabId} index={2}>
        <OrderTable />
      </TabPanel>
    </>
  );
};

interface IOrderbookProps {
  orderbookType: "bid" | "ask";
  orders: typeof PLACEHOLDERS.orders.bidOrders;
}

const OrderBook: React.FC<IOrderbookProps> = ({ orderbookType, orders }) => {
  const orderbookStyling: CSSProperties = {
    border: `2px solid ${orderbookType === "bid" ? "green" : "red"}`,
  };

  const RowsMemo = useMemo(() => {
    const mappedOrders = orders.map((order, index) => {
      return (
        <TableRow key={index}>
          <TableCell>{order.price}</TableCell>
          <TableCell>{order.qty}</TableCell>
        </TableRow>
      );
    });

    return mappedOrders;
  }, [orders]);

  return (
    <>
      <Table sx={orderbookStyling} size="small" padding="none">
        <TableHead>
          <TableCell>
            <Typography>Price</Typography>
          </TableCell>
          <TableCell>
            <Typography>Quantity</Typography>
          </TableCell>
        </TableHead>
        <TableBody>{RowsMemo}</TableBody>
      </Table>
    </>
  );
};

const DEX: React.FC = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(true);
  const isMobileMedium = useBreakpoint("<", "md");

  const handleDrawerToggle = useCallback(() => {
    setDrawerIsOpen((prev: boolean) => !prev);
  }, []);

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
              minHeight="400px"
              justifyContent="center"
            >
              <Typography>Circulating: {PLACEHOLDERS.circulatingSupply}</Typography>
              <Typography>Decimals: {PLACEHOLDERS.decimals}</Typography>
              <Link>Show Distribution</Link>
              <Typography>Description: {PLACEHOLDERS.description}</Typography>
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
              minHeight="200px"
              justifyContent="center"
            >
              {/* One input needs to be locked to JUP & the other needs to be selectable */}
              <JUPInput
                inputType="quantity"
                placeholder={"Enter Quantity"}
                fetchFn={() => {
                  console.log("implement...");
                }}
                hasAdornment={true}
              ></JUPInput>
              <div>
                <IconButton>
                  <SwapVertIcon />
                </IconButton>
              </div>
              <JUPInput
                inputType="quantity"
                placeholder={"Enter Quantity"}
                fetchFn={() => {
                  console.log("implement...");
                }}
                hasAdornment={true}
              ></JUPInput>
              <Button variant="green">SWAP</Button>
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
              minHeight="400px"
              justifyContent="center"
            >
              <OrderBook orderbookType="ask" orders={PLACEHOLDERS.orders.askOrders}></OrderBook>
              <Typography>Last Price: {PLACEHOLDERS.lastPrice}</Typography>
              <OrderBook orderbookType="bid" orders={PLACEHOLDERS.orders.bidOrders}></OrderBook>
            </Stack>
          </Grid>

          <Grid item xs={12} border="1px solid green" borderRadius="20px">
            <OrderHistory />
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
