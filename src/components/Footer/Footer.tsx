import { Box, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";
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

const StyledFooter = styled.footer`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  width: 100%;
`;

const StyledFooterInner = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  max-width: 600px;
  width: 100%;
`;

export default Footer;
