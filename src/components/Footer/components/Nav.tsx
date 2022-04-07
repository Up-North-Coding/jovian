import React from "react";
import styled from "styled-components";
import SLink from "components/SLink";

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

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  width: "100%";

  a {
    padding: 20px;
  }
`;

export default Nav;
