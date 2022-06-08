import React, { memo, useMemo } from "react";
import { Box } from "@mui/material";
import { BoxProps } from "@mui/system";
import useBreakpoint from "hooks/useBreakpoint";
import { JUPSidebarWidth } from "utils/common/constants";

// type IWidgetContainerProps = BoxProps;
interface IWidgetContainerProps extends BoxProps {
  isSidebarExpanded: boolean;
}
// Make slots for each added widget (slot1, slot2, etc and then each slot is a <Grid item>)?
const WidgetContainer: React.FC<IWidgetContainerProps> = ({ children, isSidebarExpanded }) => {
  const isMobileLarge = useBreakpoint("<", "lg");

  const ConditionalWidth = useMemo(() => {
    return isMobileLarge && !isSidebarExpanded ? "100%" : `calc(100% - ${JUPSidebarWidth}px)`;
  }, [isMobileLarge, isSidebarExpanded]);

  const ConditionalMargin = useMemo(() => {
    return isMobileLarge && !isSidebarExpanded ? "0px" : `${JUPSidebarWidth}px`;
  }, [isMobileLarge, isSidebarExpanded]);

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
