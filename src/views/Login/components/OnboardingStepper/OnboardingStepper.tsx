import React, { useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import GenerateStep from "./components/GenerateSeedStep";
import BackupSeedStep from "./components/BackupSeedStep";
import DisplayAddressStep from "./components/DisplayAddressStep";
import ReEnterSeedStep from "./components/ReEnterSeedStep";
import { Grid, styled, Typography } from "@mui/material";

const steps = [
  { name: "Generate Seed", component: GenerateStep },
  { name: "Backup Seed", component: BackupSeedStep },
  { name: "Re-Enter Seed", component: ReEnterSeedStep },
  { name: "Display Address", component: DisplayAddressStep },
];

const OnboardingStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const CurrentStepComponent = steps[activeStep].component;

  const stepHTML = steps.map((item, i) => {
    return (
      <Step key={i}>
        <StepLabel>{item.name}</StepLabel>
      </Step>
    );
  });

  const activeStepHTML = steps.map((item, i) => {
    return activeStep === i && <CurrentStepComponent key={i} stepForwardFn={() => setActiveStep(activeStep + 1)} />;
  });

  // TODO: wrap activeStepHTML in all of the grids/containers from the individual steps to dry out the step code
  // this has been adjusted slightly by adding the container with the column but more might be possible
  return (
    <StyledGrid container>
      <StyledGrid container>
        <StyledTypography>To generate a new wallet, please follow the steps below.</StyledTypography>
      </StyledGrid>
      <StyledGridItem xs={12} item>
        <Stepper activeStep={activeStep} alternativeLabel>
          {stepHTML}
        </Stepper>
      </StyledGridItem>
      <StyledGrid container direction="column">
        {activeStepHTML}
      </StyledGrid>
    </StyledGrid>
  );
};

const StyledGrid = styled(Grid)(({ theme }) => ({
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
