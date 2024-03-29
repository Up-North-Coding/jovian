import React, { memo, useCallback } from "react";
import Button from "@mui/material/Button";
import useAccount from "hooks/useAccount";
import { IStepProps } from "../types";
import { styled, Typography } from "@mui/material";

const GenerateSeedStep: React.FC<IStepProps> = ({ stepForwardFn }) => {
  const { fetchNewAccount } = useAccount();
  // Fetches a fresh wallet and then steps the stepper to the next step
  const handleGenerateClick = useCallback(async () => {
    if (fetchNewAccount === undefined) {
      return;
    }

    // Await because we need accountRs and accountSeed to be populated before moving forward (or the next step will throw alert)
    await fetchNewAccount(); // TODO: re-consider the way this is handled, does it make more sense to check on the next step?
    stepForwardFn();
  }, [fetchNewAccount, stepForwardFn]);

  return (
    <>
      <StyledTypography>Click below to generate a new account, the next page will contain your private details.</StyledTypography>

      <StyledButton size="large" onClick={handleGenerateClick} variant="green">
        Generate Wallet
      </StyledButton>
    </>
  );
};

const StyledTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    padding: "10px 50px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  ".MuiButton": {
    [theme.breakpoints.down("md")]: {
      padding: "0 20px",
    },
  },
}));

export default memo(GenerateSeedStep);
