import React from "react";
import useAccount from "hooks/useAccount";
import { Button, Typography } from "@mui/material";
import { IStepProps } from "../types";
import { Alert } from "@mui/material";
import { NavLink } from "react-router-dom";

const DisplayAccountStep: React.FC<IStepProps> = ({ stepForwardFn }) => {
  const { accountRs } = useAccount();

  return (
    <>
      <Typography>Here is your Jupiter address: {accountRs}</Typography>
      <Alert>You can give your Jupiter address to others so they can send you Jupiter!</Alert>
      <Alert severity="warning">
        Anyone can see your account based on your Jupiter address, but <strong>your seed words must remain private</strong> or others will be able to
        spend your funds.
      </Alert>
      <NavLink to="/dashboard">
        <Button size="large" variant="contained">
          Go To Dashboard
        </Button>
      </NavLink>
    </>
  );
};

export default React.memo(DisplayAccountStep);
