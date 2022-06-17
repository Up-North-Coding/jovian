import React, { memo } from "react";
import useBlocks from "hooks/useBlocks";
import styled from "@emotion/styled";
import { Chip } from "@mui/material";

export const DailyTransactionsDisplay: React.FC = () => {
  const { dailyTxs } = useBlocks();

  return <AvgTxChip label={`24 Hr Txs: ${dailyTxs}`} />;
};

export const AvgTxChip = styled(Chip)(({ theme }) => ({
  position: "relative",
  left: "50%",
  right: "50%",
  margin: "0px 10px",
}));

export default memo(DailyTransactionsDisplay);
