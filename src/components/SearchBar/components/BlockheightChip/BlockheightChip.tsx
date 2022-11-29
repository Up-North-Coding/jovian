import React, { memo } from "react";
import { Chip, styled } from "@mui/material";
import useBlocks from "hooks/useBlocks";
import useBreakpoint from "hooks/useBreakpoint";
import { addCommaSeparators } from "utils/common/addCommaSeparators";

const BlockheightChip: React.FC = () => {
  const { blockHeight } = useBlocks();
  const isMobileMedium = useBreakpoint("<", "md");

  return <StyledChip color="primary" label={isMobileMedium ? blockHeight : "Height: " + addCommaSeparators(blockHeight)} />;
};

const StyledChip = styled(Chip)(() => ({
  margin: "0px 10px",
}));

export default memo(BlockheightChip);
