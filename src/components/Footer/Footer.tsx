import { Box, Typography, styled } from "@mui/material";
import React, { memo } from "react";
import Nav from "./components/Nav";

const Footer: React.FC = () => (
  <StyledFooter>
    <StyledFooterInner>
      <Nav />
    </StyledFooterInner>

    <Box style={{ paddingBottom: "60px" }}>
      <Typography>v{APP_VERSION}</Typography>
    </Box>
  </StyledFooter>
);
const StyledFooter = styled("footer")(() => ({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  textAlign: "center",
  width: "100%",
}));
const StyledFooterInner = styled("div")(() => ({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  maxWidth: "600px",
  width: "100%",
}));

export default memo(Footer);
