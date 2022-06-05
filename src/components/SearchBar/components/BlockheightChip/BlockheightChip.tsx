import React, { memo } from "react";
import { Chip, styled } from "@mui/material";
import useBlocks from "hooks/useBlocks";
import useBreakpoint from "hooks/useBreakpoint";

const BlockheightChip: React.FC = () => {
  const { blockHeight } = useBlocks();
  const isMobileMedium = useBreakpoint("<", "md");

  return <StyledChip color="primary" label={isMobileMedium ? blockHeight : "Height: " + blockHeight} />;
};

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: "0px 10px",
}));

export default memo(BlockheightChip);
