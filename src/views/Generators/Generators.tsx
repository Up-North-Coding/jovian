import React, { memo, useEffect, useMemo, useState } from "react";
import Page from "components/Page";
import MetricsGroup from "./components/MetricsGroup/MetricsGroup";
import useBlocks from "hooks/useBlocks";
import JUPTable, { ITableRow } from "components/JUPTable";
import { IGenerator } from "types/NXTAPI";
import { generatorOverviewHeaders } from "./constants/generatorOverviewHeaders";
import useAPI from "hooks/useAPI";
import { isPollingFrequencyMet } from "utils/common/isPollingFrequencyMet";
import { GeneratorPollingFrequency } from "utils/common/constants";

const Generators: React.FC = () => {
  const [lastGetGeneratorsBlock, setLastGetGeneratorsBlock] = useState<number>(0);
  const { blockHeight, latestBlocktime } = useBlocks();
  const { getGenerators, generators } = useAPI();

  const generatorOverviewRows: Array<ITableRow> | undefined = useMemo(() => {
    if (generators === undefined || !Array.isArray(generators)) {
      return undefined;
    }

    return generators.map((generator: IGenerator) => {
      return {
        account: generator.accountRS,
        effectiveBalance: `${generator.effectiveBalanceNXT} JUP`,
        hitTime: generator.hitTime,
        deadline: generator.deadline,
      };
    });
  }, [generators]);

  useEffect(() => {
    if (blockHeight === undefined || getGenerators === undefined) {
      return;
    }

    if (!isPollingFrequencyMet(GeneratorPollingFrequency, lastGetGeneratorsBlock, blockHeight)) {
      return;
    }

    getGenerators();
    setLastGetGeneratorsBlock(blockHeight);
  }, [blockHeight, getGenerators, lastGetGeneratorsBlock]);

  return (
    <Page>
      <MetricsGroup
        lastBlockTime={latestBlocktime ? new Date(latestBlocktime).toDateString() : "-"}
        currentHeight={blockHeight ? blockHeight.toString() : "-"}
        activeForgers={generators ? generators.length.toString() : "-"}
      />
      <JUPTable
        keyProp={"account"}
        title="Generators"
        path={"/generators"}
        rows={generatorOverviewRows}
        headCells={generatorOverviewHeaders}
        isPaginated
      />
    </Page>
  );
};

export default memo(Generators);
