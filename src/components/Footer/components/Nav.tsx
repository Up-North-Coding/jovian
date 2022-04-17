import React, { memo } from "react";
import SLink from "components/SLink";
import { styled } from "@mui/material";

const Nav: React.FC = () => (
  <StyledNav>
    <SLink external href="https://twitter.com/">
      Twitter
    </SLink>
    <SLink external href="https://discord.gg">
      Discord
    </SLink>
    <SLink external href="https://medium.com">
      Medium
    </SLink>
    <SLink external href="https://github.com/">
      ToS
    </SLink>
  </StyledNav>
);
const StyledNav = styled("nav")(() => ({
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  width: "100%",
  a: {
    padding: "20px",
  },
}));

export default memo(Nav);
