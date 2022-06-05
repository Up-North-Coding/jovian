import React, { memo } from "react";
import { Box } from "@mui/material";
import { BoxProps } from "@mui/system";
import useBreakpoint from "hooks/useBreakpoint";
import { JUPSidebarWidth } from "utils/common/constants";

type IWidgetContainerProps = BoxProps;

// Make slots for each added widget (slot1, slot2, etc and then each slot is a <Grid item>)?
const WidgetContainer: React.FC<IWidgetContainerProps> = ({ children }) => {
  const isMobileLarge = useBreakpoint("<", "lg");

  return (
    <Box
      sx={{
        padding: "0px 20px",
        width: isMobileLarge ? "100%" : `calc(100% - ${JUPSidebarWidth}px)`,
        ml: isMobileLarge ? 0 : `${JUPSidebarWidth}px`,
      }}
    >
      {children}
    </Box>
  );
};

export default memo(WidgetContainer);
