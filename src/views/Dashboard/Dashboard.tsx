import React from "react";
import Page from "components/Page";
import WidgetContainer from "./components/WidgetContainer";
import Drawer from "./components/Drawer";
import MyToolbar from "./components/MyToolbar";
import { Grid, Typography } from "@mui/material";
/* 
  Component selection considerations (design)

    TBD...
*/

const Dashboard: React.FC = () => {
  return (
    <Page>
      <Drawer />
      <MyToolbar />
      <WidgetContainer>
        <Grid container sx={{ border: "1px solid white" }}>
          <Grid xs={6} item sx={{ border: "1px white dashed" }}>
            <Typography>I'm a container widget child</Typography>
          </Grid>
          <Grid xs={6} item sx={{ border: "1px white dashed" }}>
            <Typography>I'm another container widget child</Typography>
          </Grid>
        </Grid>
      </WidgetContainer>
    </Page>
  );
};

export default React.memo(Dashboard);
