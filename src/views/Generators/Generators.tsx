import React, { memo, useMemo } from "react";
import Page from "components/Page";
import MetricsGroup from "./components/MetricsGroup/MetricsGroup";
import useBlocks from "hooks/useBlocks";
import JUPTable from "components/JUPTable";
import { IGenerator } from "types/NXTAPI";
import { generatorOverviewHeaders } from "./constants/generatorOverviewHeaders";

const Generators: React.FC = () => {
  const { blockHeight, latestBlocktime } = useBlocks();

  // const generatorOverviewRows: Array<ITableRow> | undefined = useMemo(() => {
  //   if (recentBlocks === undefined || !Array.isArray(recentBlocks)) {
  //     return undefined;
  //   }

  //   return recentBlocks.map((block) => {
  //     return {
  //       account: block.height.toString(),
  //       effectiveBalance: TimestampToDate(block.timestamp),
  //       hitTime: <Link onClick={() => handleOpenBlockDetail(block.height)}>{block.height}</Link>,
  //       deadline: block.numberOfTransactions.toString(),
  //       remaining: block.totalAmountNQT,
  //     };
  //   });
  // }, [recentBlocks, handleOpenBlockDetail]);

  return (
    <Page>
      <MetricsGroup
        lastBlockTime={latestBlocktime ? new Date(latestBlocktime).toDateString() : "-"}
        currentHeight={blockHeight ? blockHeight.toString() : "-"}
        activeForgers={blockHeight ? blockHeight.toString() : "-"}
      />
      <JUPTable keyProp={"account"} title="Forgers" rows={generatorOverviewRows} headCells={generatorOverviewHeaders}></JUPTable>
    </Page>
  );
};

export default memo(Generators);
