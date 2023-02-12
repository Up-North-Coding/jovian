import { Typography } from "@mui/material";
import React, { memo } from "react";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";

const EmptyTable: React.FC = () => {
  return (
    <>
      <MoneyOffIcon color="primary" />
      <Typography color="primary">No assets to display</Typography>
    </>
  );
};

export default memo(EmptyTable);
