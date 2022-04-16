import React, { memo, useMemo, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import GenerateSeedStep from "./components/1.GenerateSeedStep";
import BackupSeedStep from "./components/2.BackupSeedStep";
import ReEnterSeedStep from "./components/3.ReEnterSeedStep";
import DisplayAddressStep from "./components/4.DisplayAddressStep";
import { Box, Typography, styled } from "@mui/material";
import { IStepProps } from "./components/types";
import useBreakpoint from "hooks/useBreakpoint";

// TODO: more of a broad note, but review each of the tests in OnboardingStepper/components and determine if they're needed anymore due to cypress tests

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
  ],
  OnboardingStepper: React.FC = () => {
    const [activeStep, setActiveStep] = useState<number>(0),
      isSmallBrowser = useBreakpoint("<", "sm"),
      // Stores the step label text and elements separately from the active step
      stepHTML = useMemo(
        () =>
          steps.map((item) => (
            <Step key={item.name}>
              <StepLabel>{item.name}</StepLabel>
            </Step>
          )),
        []
      ),
      // Stores the currently active step component so only that one can be rendered
      activeStepHTML = useMemo(
        () =>
          steps
            .filter((f, i) => i === activeStep)
            .map((item) => {
              const CurrentStepComponent = item.component;
              return <CurrentStepComponent key={`${item.name}active`} stepForwardFn={() => setActiveStep(activeStep + 1)} />;
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
  },
  StyledFlexBox = styled(Box)(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "30px",
  })),
  StyledTypography = styled(Typography)(({ theme }) => ({
    margin: theme.spacing(2),
  }));

export default memo(OnboardingStepper);
