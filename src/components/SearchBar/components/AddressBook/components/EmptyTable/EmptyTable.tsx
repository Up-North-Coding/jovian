import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import { Typography } from "@mui/material";
import React, { memo } from "react";

const EmptyTable: React.FC = () => {
  return (
    <>
      <NoAccountsIcon color="primary" />
      <Typography color="primary">No addresses to display</Typography>
    </>
  );
};

export default memo(EmptyTable);
