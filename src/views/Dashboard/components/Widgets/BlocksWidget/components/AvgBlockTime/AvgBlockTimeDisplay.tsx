import React, { memo } from "react";
import useBlocks from "hooks/useBlocks";
import { Chip, styled } from "@mui/material";

const AvgBlockTimeDisplay: React.FC = () => {
  const { avgBlockTime } = useBlocks();

  return <AvgBlockTimeChip label={`AVG Block Time: ${avgBlockTime} sec`} />;
};

export const AvgBlockTimeChip = styled(Chip)(() => ({
  position: "relative",
  left: "50%",
  right: "50%",
  margin: "0px 10px",
}));

export default memo(AvgBlockTimeDisplay);
