import React, { memo } from "react";
import { Typography } from "@mui/material";
import Page from "components/Page";
import Drawer from "../../components/Drawer";
import SearchBar from "components/SearchBar";

const Transactions: React.FC = () => {
  return (
    <Page>
      <Drawer />
      <SearchBar />
      <Typography>Placeholder for the full Transactions page, coming soon.</Typography>
    </Page>
  );
};

export default memo(Transactions);
