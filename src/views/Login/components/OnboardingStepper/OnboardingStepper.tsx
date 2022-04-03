import React, { useMemo, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import GenerateSeedStep from "./components/1.GenerateSeedStep";
import BackupSeedStep from "./components/2.BackupSeedStep";
import ReEnterSeedStep from "./components/3.ReEnterSeedStep";
import DisplayAddressStep from "./components/4.DisplayAddressStep";
import { Box, Grid, styled, Typography } from "@mui/material";
import { IStepProps } from "./components/types";

interface IOnboardingStep {
  name: string;
  component: React.FunctionComponent<IStepProps>;
}

const steps: Array<IOnboardingStep> = [
  { name: "Generate Seed", component: GenerateSeedStep },
  { name: "Backup Seed", component: BackupSeedStep },
  { name: "Re-Enter Seed", component: ReEnterSeedStep },
  { name: "Display Address", component: DisplayAddressStep },
];

const OnboardingStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  // stores the step label text and elements separately from the active step
  const stepHTML = useMemo(
    () =>
      steps.map((item, i) => {
        return (
          <Step key={item.name}>
            <StepLabel>{item.name}</StepLabel>
          </Step>
        );
      }),
    []
  );

  // stores the currently active step component so only that one can be rendered
  const activeStepHTML = useMemo(
    () =>
      steps
        .filter((f, i) => i === activeStep)
        .map((item, i) => {
          const CurrentStepComponent = item.component;
          return <CurrentStepComponent key={item.name + "active"} stepForwardFn={() => setActiveStep(activeStep + 1)} />;
        }),
    [activeStep]
  );

  // TODO: wrap activeStepHTML in all of the grids/containers from the individual steps to dry out the step code
  // this has been adjusted slightly by adding the container with the column but more might be possible
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "30px" }}>
      <StyledTypography>To generate a new wallet, please follow the steps below.</StyledTypography>

      <Stepper sx={{ width: "80vw" }} activeStep={activeStep} alternativeLabel>
        {stepHTML}
      </Stepper>

      <Box sx={{ width: "60vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "30px" }}>
        {activeStepHTML}
      </Box>
    </Box>
  );
};

const StyledGridContainer = styled(Grid)(({ theme }) => ({
  justifyContent: "center",
  alignContent: "center",
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  justifyContent: "center",
  alignContent: "center",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
}));

export default React.memo(OnboardingStepper);
