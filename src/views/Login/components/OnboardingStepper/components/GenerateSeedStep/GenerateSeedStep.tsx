import React from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import useAccount from "hooks/useAccount";
import { IStepProps } from "../types";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

const GenerateSeedStep: React.FC<IStepProps> = ({ stepForwardFn }) => {
  const { accountRs, accountSeed, fetchFn } = useAccount();

  if (fetchFn === undefined) {
    return <></>;
  }

  // fetches a fresh wallet and then steps the stepper to the next step
  const handleGenerateClick = async () => {
    await fetchFn();
    stepForwardFn();
  };

  if (!accountRs || !accountSeed) {
    return (
      <StyledGridContainer container spacing={0} direction="column">
        <StyledGridItem item xs={3}>
          <Typography>Click below to generate a new account, the next page will contain your private details.</Typography>
        </StyledGridItem>
        <StyledGridItem item xs={3}>
          <StyledButton onClick={handleGenerateClick} variant="contained">
            Generate Wallet
          </StyledButton>
        </StyledGridItem>
      </StyledGridContainer>
    );
  }

  return <></>;
};

const StyledButton = styled(Button)({ width: "80%" });

const StyledGridContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  width: "80%",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

export default React.memo(GenerateSeedStep);
