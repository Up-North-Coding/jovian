import React, { memo } from "react";
import { Typography } from "@mui/material";
import CollapseExample from "components/CollapseExample";

const PortfolioApp: React.FC = () => {
  return (
    <>
      <Typography variant="h2" textAlign="center">
        Portfolio Details
      </Typography>
      <CollapseExample />
    </>
  );
};

export default memo(PortfolioApp);
