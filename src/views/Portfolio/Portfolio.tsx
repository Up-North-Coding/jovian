import React, { memo } from "react";
import Page from "components/Page";
import { Typography } from "@mui/material";
import CollapsingPortfolioTable from "components/CollapsingPortfolioTable";

const Portfolio: React.FC = () => {
  return (
    <Page>
      <Typography variant="h2" textAlign="center">
        Portfolio Details
      </Typography>
      <CollapsingPortfolioTable />
    </Page>
  );
};

export default memo(Portfolio);
