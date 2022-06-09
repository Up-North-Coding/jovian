import React, { memo, useMemo } from "react";
import { Box } from "@mui/material";
import { BoxProps } from "@mui/system";
import { JUPSidebarWidth } from "utils/common/constants";

interface IWidgetContainerProps extends BoxProps {
  isSidebarExpanded: boolean;
}
const WidgetContainer: React.FC<IWidgetContainerProps> = ({ children, isSidebarExpanded }) => {
  const ConditionalWidth = useMemo(() => {
    return isSidebarExpanded ? `calc(100% - ${JUPSidebarWidth}px)` : "100%";
  }, [isSidebarExpanded]);

  const ConditionalMargin = useMemo(() => {
    return isSidebarExpanded ? `${JUPSidebarWidth}px` : "0px";
  }, [isSidebarExpanded]);

  return (
    <Box
      sx={{
        padding: "0px 20px",
        width: ConditionalWidth,
        ml: ConditionalMargin,
      }}
    >
      {children}
    </Box>
  );
};

export default memo(WidgetContainer);
