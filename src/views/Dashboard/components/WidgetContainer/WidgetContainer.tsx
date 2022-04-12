import React from "react";
import { Box } from "@mui/material";
import { BoxProps } from "@mui/system";

interface IWidgetContainerProps extends BoxProps {}

// TODO: handle better
const drawerWidth = 240;

// make slots for each added widget (slot1, slot2, etc and then each slot is a <Grid item>)?
const WidgetContainer: React.FC<IWidgetContainerProps> = ({ children }) => {
  return <Box sx={{ padding: "10px", width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>{children}</Box>;
};

export default React.memo(WidgetContainer);
