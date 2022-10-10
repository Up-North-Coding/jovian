import React, { memo } from "react";
import Page from "components/Page";
import BlocksWidget from "views/Dashboard/components/Widgets/BlocksWidget";
import MetricsGroup from "./components/MetricsGroup/MetricsGroup";
import useBlocks from "hooks/useBlocks";

const Blocks: React.FC = () => {
  const { avgBlockTime, dailyTxs, dailyFees, avgTxValue } = useBlocks();
  return (
    <Page>
      <MetricsGroup
        transactions24Hours={dailyTxs ? dailyTxs : "-"}
        fees24Hours={dailyFees ? dailyFees : "-"}
        valuePerBlock={avgTxValue ? avgTxValue : "-"}
        blockGenerationTime={avgBlockTime ? avgBlockTime : "-"}
      />
      <BlocksWidget disableDisplayComponents />
    </Page>
  );
};

export default memo(Blocks);
