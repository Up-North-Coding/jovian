import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Nav from "./components/Nav";
import Typography from "@mui/material/Typography";

const Footer: React.FC = () => {
  const [buildVersion, setBuildVersion] = useState("");

  const fetchBuildVersion = useCallback(() => {
    if (!window?.document) {
      return;
    }

    const elem = window.document?.querySelector('meta[name="build_version"]')?.getAttribute("content");

    if (!elem) {
      return;
    }

    setBuildVersion(elem);
  }, []);

  useEffect(() => {
    if (fetchBuildVersion === undefined) {
      return;
    }

    fetchBuildVersion();
  }, [fetchBuildVersion]);

  return (
    <StyledFooter>
      <StyledFooterInner>
        <Nav />
      </StyledFooterInner>

      <div style={{ paddingBottom: "60px" }}>
        <Typography variant="body1" sx={{ color: "#7c818d", fontStyle: "italic", fontSize: "12px" }}>
          v{buildVersion}
        </Typography>
      </div>
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
