import React, { memo } from "react";
import { Chip } from "@mui/material";
import useBlocks from "hooks/useBlocks";

const BlockheightChip: React.FC = () => {
  const { blockHeight } = useBlocks();

  return <Chip label={"Height: " + blockHeight} />;
};
export default memo(BlockheightChip);
