import React, { useMemo, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import GenerateSeedStep from "./components/1.GenerateSeedStep";
import BackupSeedStep from "./components/2.BackupSeedStep";
import ReEnterSeedStep from "./components/3.ReEnterSeedStep";
import DisplayAddressStep from "./components/4.DisplayAddressStep";
import { Box, styled, Typography } from "@mui/material";
import { IStepProps } from "./components/types";
import useBreakpoint from "hooks/useBreakpoint";

interface IOnboardingStep {
  name: string;
  component: React.FunctionComponent<IStepProps>;
}

// Populates the onboarding step component. "name" is displayed to the user, "component" is a React component to display for the step
const steps: Array<IOnboardingStep> = [
  { name: "Generate Seed", component: GenerateSeedStep },
  { name: "Backup Seed", component: BackupSeedStep },
  { name: "Re-Enter Seed", component: ReEnterSeedStep },
  { name: "Display Address", component: DisplayAddressStep },
];

const OnboardingStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const isSmallBrowser = useBreakpoint("<", "sm");

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

  return (
    <StyledFlexBox>
      <StyledTypography>To generate a new wallet please follow the steps below.</StyledTypography>

      <Stepper sx={{ width: isSmallBrowser === true ? "100%" : "80vw" }} activeStep={activeStep} alternativeLabel>
        {stepHTML}
      </Stepper>

      <StyledFlexBox sx={{ width: isSmallBrowser === true ? "100%" : "70vw" }}>{activeStepHTML}</StyledFlexBox>
    </StyledFlexBox>
  );
};

const StyledFlexBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "30px",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2),
}));

export default React.memo(OnboardingStepper);
