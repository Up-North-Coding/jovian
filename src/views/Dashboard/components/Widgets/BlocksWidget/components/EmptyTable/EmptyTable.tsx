import WidgetsIcon from "@mui/icons-material/Widgets";
import { Typography } from "@mui/material";
import React, { memo } from "react";

const EmptyTable: React.FC = () => {
  return (
    <>
      <WidgetsIcon color="primary" />
      <Typography color="primary">No blocks to display</Typography>
    </>
  );
};

export default memo(EmptyTable);
