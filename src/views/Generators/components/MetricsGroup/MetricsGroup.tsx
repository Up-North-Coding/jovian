import { Grid, Stack, Typography } from "@mui/material";
import React, { memo, useMemo } from "react";
import { TimerOutlined as TimerIcon, Layers as HeightIcon, PrecisionManufacturing as ForgeIcon } from "@mui/icons-material/";

interface ISingleMetricProps {
  metricValue: string;
  description: string;
  icon: JSX.Element;
}

// controls the font size of the metrics icons
const iconSize = "50px";

interface IMetricsGroupProps {
  lastBlockTime: string;
  currentHeight: string;
  activeForgers: string;
}

const MetricsGroup: React.FC<IMetricsGroupProps> = ({ lastBlockTime, currentHeight, activeForgers }) => {
  const MetricsMemo = useMemo(() => {
    const JUP_Metrics: Array<ISingleMetricProps> = [
      {
        metricValue: lastBlockTime,
        description: "Last Blocktime",
        icon: <TimerIcon color="primary" sx={{ fontSize: iconSize }} />,
      },
      {
        metricValue: currentHeight,
        description: "Blockheight",
        icon: <HeightIcon color="primary" sx={{ fontSize: iconSize }} />,
      },
      {
        metricValue: activeForgers,
        description: "Active Forgers",
        icon: <ForgeIcon color="primary" sx={{ fontSize: iconSize }} />,
      },
    ];

    return JUP_Metrics.map((metric: ISingleMetricProps) => {
      return (
        <Grid key={`grid-${metric.description}`} container width="280px" border="1px solid green" borderRadius="20px" padding={"10px"}>
          <Grid item xs={9}>
            <Typography variant="h3">{metric.metricValue}</Typography>
          </Grid>
          <Grid item xs={3}>
            {metric.icon}
          </Grid>
          <Grid item xs={12}>
            <Typography>{metric.description}</Typography>
          </Grid>
        </Grid>
      );
    });
  }, [activeForgers, currentHeight, lastBlockTime]);

  return (
    <Stack direction="row" spacing={2} marginTop="15px">
      <Grid container justifyContent="space-between">
        {MetricsMemo}
      </Grid>
    </Stack>
  );
};

export default memo(MetricsGroup);
