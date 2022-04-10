import React from "react";
import SLink from "components/SLink";
import { styled } from "@mui/material";

const Nav: React.FC = () => {
  return (
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
};

const StyledNav = styled("nav")(({ theme }) => ({
  "align-items": "center",
  display: "flex",
  "flex-wrap": "wrap",
  width: "100%",
  a: {
    padding: "20px",
  },
}));

export default React.memo(Nav);
