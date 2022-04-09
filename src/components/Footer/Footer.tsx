import React from "react";
// CR: change import to mui styled
import styled from "styled-components";
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

// CR: change to object syntax for styled
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
