import React, { memo } from "react";
import { Typography } from "@mui/material";
import CollapsingPortfolioTable from "components/CollapsingPortfolioTable";

const PortfolioApp: React.FC = () => {
  return (
    <>
      <Typography variant="h2" textAlign="center">
        Portfolio Details
      </Typography>
      <CollapsingPortfolioTable />
    </>
  );
};

export default memo(PortfolioApp);
