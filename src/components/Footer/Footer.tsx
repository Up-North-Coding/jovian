import { Box, Typography } from "@mui/material";
import React from "react";
import { styled } from "@mui/material";
import Nav from "./components/Nav";

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <StyledFooterInner>
        <Nav />
      </StyledFooterInner>

      <Box style={{ paddingBottom: "60px" }}>
        <Typography>v{APP_VERSION}</Typography>
      </Box>
    </StyledFooter>
  );
};

const StyledFooter = styled("footer")(({ theme }) => ({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  textAlign: "center",
  width: "100%",
}));

const StyledFooterInner = styled("div")(({ theme }) => ({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  maxWidth: "600px",
  width: "100%",
}));

export default React.memo(Footer);
