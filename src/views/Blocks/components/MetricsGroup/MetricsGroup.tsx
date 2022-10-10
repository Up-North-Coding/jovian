import { Grid, Icon, Stack, styled, Typography } from "@mui/material";
import React, { memo } from "react";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PriceChangeIcon from "@mui/icons-material/PriceChangeOutlined";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import TimerIcon from "@mui/icons-material/TimerOutlined";

interface ISingleMetricProps {
  metricValue: string;
  description: string;
  icon: JSX.Element;
}

const iconSize = "50px";

const JUP_Metrics: Array<ISingleMetricProps> = [
  {
    metricValue: "12",
    description: "Transactions - Past 24 hrs",
    icon: <ReceiptLongIcon color="primary" sx={{ fontSize: iconSize, alignSelf: "left", justifySelf: "left" }} />,
  },
  {
    metricValue: "14",
    description: "Fees - Past 24 hrs",
    icon: <PriceChangeIcon color="primary" sx={{ fontSize: iconSize }} />,
  },
  {
    metricValue: "1",
    description: "AVG Value Per Block",
    icon: <PriceCheckIcon color="primary" sx={{ fontSize: iconSize }} />,
  },
  {
    metricValue: "10s",
    description: "Block Generation Time",
    icon: <TimerIcon color="primary" sx={{ fontSize: iconSize }} />,
  },
];

// const SingleMetric: React.FC<ISingleMetricProps> = ({ metricValue, description }) => {
//   return (
//     <Grid container width="250px" border="1px solid green" borderRadius="20px">
//       <Grid item xs={12}>
//         <Typography variant="h3">{metricValue}</Typography>
//       </Grid>
//       <Grid item xs={12}>
//         <Typography margin="10px">{description}</Typography>
//       </Grid>
//     </Grid>
//   );
// };

const MetricsGroup: React.FC = () => {
  return (
    <Stack direction="row" spacing={2} marginTop="15px">
      <Grid container justifyContent="space-between">
        {JUP_Metrics.map((metric) => {
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
        })}
      </Grid>
    </Stack>
  );
};

export default memo(MetricsGroup);
