import React from "react";
import useAccount from "hooks/useAccount";
import { Button, Grid, styled, Typography } from "@mui/material";
import { IStepProps } from "../types";
import { Alert } from "@mui/material";
import { NavLink } from "react-router-dom";

const DisplayAccountStep: React.FC<IStepProps> = ({ stepForwardFn }) => {
  const { accountRs } = useAccount();

  return (
    <>
      <StyledGridContainer container>
        <StyledGridItem item>
          <StyledTypography>Here is your Jupiter address: {accountRs}</StyledTypography>
        </StyledGridItem>
        <StyledGridItem item>
          <StyledAlert>You can give your Jupiter address to others so they can send you Jupiter!</StyledAlert>
        </StyledGridItem>
        <StyledGridItem item>
          <StyledAlert severity="warning">
            Anyone can see your account based on your Jupiter address, but <strong>your seed words must remain private</strong> or others will be able
            to spend your funds.
          </StyledAlert>
        </StyledGridItem>
        <StyledGridItem item>
          <NavLink to="/dashboard">
            <Button variant="contained">Go To Dashboard</Button>
          </NavLink>
        </StyledGridItem>
      </StyledGridContainer>
    </>
  );
};

const StyledGridContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  width: "80%",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  width: "80%",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
}));

export default React.memo(DisplayAccountStep);
