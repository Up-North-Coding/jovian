import React, { useCallback, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import JUPAppBar from "components/JUPAppBar";
import Drawer from "components/Drawer";
import useBreakpoint from "hooks/useBreakpoint";
import WidgetContainer from "views/Dashboard/components/WidgetContainer";

const Page: React.FC = ({ children }) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(true);

  const isMobileMedium = useBreakpoint("<", "md");

  const handleDrawerToggle = useCallback(() => {
    setDrawerIsOpen((prev: boolean) => !prev);
  }, []);

  // sets the drawer state when the mobile breakpoint is hit
  useEffect(() => {
    if (isMobileMedium) {
      setDrawerIsOpen(false);
      return;
    }
    setDrawerIsOpen(true);
  }, [isMobileMedium]);

  return (
    <>
      <StyledMain>
        <Drawer isSidebarExpanded={drawerIsOpen} />
        <JUPAppBar toggleFn={handleDrawerToggle} isSidebarExpanded={drawerIsOpen} />
        <WidgetContainer isSidebarExpanded={drawerIsOpen}>{children}</WidgetContainer>
      </StyledMain>
    </>
  );
};
const StyledMain = styled("div")(({ theme }) => ({
  alignItems: "center",
  boxSizing: "border-box",
  background: theme.palette.primary.dark,
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  color: "#fff",
  paddingBottom: "150px",
}));

export default Page; // Doing page as a memo breaks things
