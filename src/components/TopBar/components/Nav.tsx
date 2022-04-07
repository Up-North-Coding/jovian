import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import SLink from "components/SLink";

const Nav: React.FC = () => {
  return (
    <StyledNav>
      <StyledRouterLink to="/dashboard">Dashboard</StyledRouterLink>
      <SLink external href="www.google.com"></SLink>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`;

const StyledRouterLink = styled(NavLink)(({ theme }) => ({
  color: "red",
  "font-weight": "700",
  "font-size": "30px",
  "padding-left": "3px",
  "padding-right": "3px",
  "text-decoration": "none",
  "&:hover": {
    color: "red",
  },
  "&.active": {
    color: "red",
  },
}));

export default Nav;
