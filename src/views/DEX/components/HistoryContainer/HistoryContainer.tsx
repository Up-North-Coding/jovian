import React, { memo, useState } from "react";
import { Tab, Tabs } from "@mui/material";
import OverallOrderHistory from "./Components/OverallOrderHistory";
import MyOpenOrders from "./Components/MyOpenOrders";
import MyOrderHistory from "./Components/MyOrderHistory";
import { tabPropsById, TabPanel } from "../../DEX";

interface IOrderHistoryProps {
  assetId?: string;
}
const HistoryContainer: React.FC<IOrderHistoryProps> = ({ assetId }) => {
  const [tabId, setCurrentTabId] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTabId(newValue);
  };

  return (
    <>
      {/* Tabs themselves */}
      <Tabs value={tabId} centered onChange={handleTabChange} aria-label="Detailed overview for block">
        <Tab label="Swap History" {...tabPropsById(0)} />
        <Tab label="My Open Swaps" {...tabPropsById(1)} />
        <Tab label="My Swap History" {...tabPropsById(2)} />
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

export default memo(HistoryContainer);
