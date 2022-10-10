import React, { memo } from "react";
import Page from "components/Page";
import BlocksWidget from "views/Dashboard/components/Widgets/BlocksWidget";
import MetricsGroup from "./components/MetricsGroup/MetricsGroup";

const Blocks: React.FC = () => {
  return (
    <Page>
      <MetricsGroup />
      <BlocksWidget disableDisplayComponents />
    </Page>
  );
};

export default memo(Blocks);
