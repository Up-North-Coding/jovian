import React from "react";
import Page from "components/Page";
import Logo from "components/Logo";
import { Typography } from "@mui/material";

/* 
  Component selection considerations (design)

    TBD...
*/

const Dashboard: React.FC = () => {
  return (
    <Page>
      <Logo />
      <Typography>ITS A DASHBOARD</Typography>
    </Page>
  );
};

export default React.memo(Dashboard);
