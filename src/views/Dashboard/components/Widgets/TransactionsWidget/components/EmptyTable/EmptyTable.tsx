import { Typography } from "@mui/material";
import React, { memo } from "react";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const EmptyTable: React.FC = () => {
  return (
    <>
      <ReceiptLongIcon color="primary" />
      <Typography color="primary">No transaction history to display</Typography>
    </>
  );
};

export default memo(EmptyTable);
