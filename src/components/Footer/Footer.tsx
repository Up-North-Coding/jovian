import React from "react";
import { styled } from "@mui/material";
import Nav from "./components/Nav";

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <StyledFooterInner>
        <Nav />
      </StyledFooterInner>

      <div style={{ paddingBottom: "60px" }}></div>
    </StyledFooter>
  );
};

const StyledFooter = styled("footer")(({ theme }) => ({
  "align-items": "center",
  display: "flex",
  "justify-content": "center",
  "flex-direction": "column",
  "text-align": "center",
  width: "100%",
}));

const StyledFooterInner = styled("div")(({ theme }) => ({
  "align-items": "center",
  display: "flex",
  "justify-content": "center",
  "max-width": "600px",
  width: "100%",
}));

export default React.memo(Footer);
