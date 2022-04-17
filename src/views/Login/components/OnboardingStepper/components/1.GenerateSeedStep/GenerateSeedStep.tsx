import React, { memo, useCallback } from "react";
import Button from "@mui/material/Button";
import useAccount from "hooks/useAccount";
import { IStepProps } from "../types";
import { Typography } from "@mui/material";

const GenerateSeedStep: React.FC<IStepProps> = ({ stepForwardFn }) => {
  const { fetchFn } = useAccount();
  // Fetches a fresh wallet and then steps the stepper to the next step
  const handleGenerateClick = useCallback(async () => {
    if (fetchFn === undefined) {
      return;
    }

    // Await because we need accountRs and accountSeed to be populated before moving forward (or the next step will throw alert)
    await fetchFn(); // TODO: re-consider the way this is handled, does it make more sense to check on the next step?
    stepForwardFn();
  }, [fetchFn, stepForwardFn]);

  return (
    <>
      <Typography>Click below to generate a new account, the next page will contain your private details.</Typography>

      <Button size="large" onClick={handleGenerateClick} variant="contained">
        Generate Wallet
      </Button>
    </>
  );
};

export default memo(GenerateSeedStep);
