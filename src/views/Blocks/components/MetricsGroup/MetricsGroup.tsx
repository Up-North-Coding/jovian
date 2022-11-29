import { Grid, Stack, Typography } from "@mui/material";
import React, { memo, useMemo } from "react";
import {
  ReceiptLong as ReceiptLongIcon,
  PriceChangeOutlined as PriceChangeIcon,
  PriceCheck as PriceCheckIcon,
  TimerOutlined as TimerIcon,
} from "@mui/icons-material/";

interface ISingleMetricProps {
  metricValue: string;
  description: string;
  icon: JSX.Element;
}

// controls the font size of the metrics icons
const iconSize = "50px";

interface IMetricsGroupProps {
  transactions24Hours: string;
  fees24Hours: string;
  valuePerBlock: string;
  blockGenerationTime: string;
}

const MetricsGroup: React.FC<IMetricsGroupProps> = ({ transactions24Hours, fees24Hours, valuePerBlock, blockGenerationTime }) => {
  const MetricsMemo = useMemo(() => {
    const JUP_Metrics: Array<ISingleMetricProps> = [
      {
        metricValue: transactions24Hours,
        description: "Transactions - Past 24 hrs",
        icon: <ReceiptLongIcon color="primary" sx={{ fontSize: iconSize }} />,
      },
      {
        metricValue: fees24Hours,
        description: "Fees - Past 24 hrs",
        icon: <PriceChangeIcon color="primary" sx={{ fontSize: iconSize }} />,
      },
      {
        metricValue: valuePerBlock,
        description: "AVG Value Per Block",
        icon: <PriceCheckIcon color="primary" sx={{ fontSize: iconSize }} />,
      },
      {
        metricValue: blockGenerationTime,
        description: "Block Generation Time",
        icon: <TimerIcon color="primary" sx={{ fontSize: iconSize }} />,
      },
    ];

    return JUP_Metrics.map((metric: ISingleMetricProps) => {
      return (
        <Grid key={`grid-${metric.description}`} container width="250px" border="1px solid green" borderRadius="20px" padding={"10px"}>
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
  }, [blockGenerationTime, fees24Hours, transactions24Hours, valuePerBlock]);

  return (
    <Stack direction="row" spacing={2} marginTop="15px">
      <Grid container justifyContent="space-between">
        {MetricsMemo}
      </Grid>
    </Stack>
  );
};

export default memo(MetricsGroup);
