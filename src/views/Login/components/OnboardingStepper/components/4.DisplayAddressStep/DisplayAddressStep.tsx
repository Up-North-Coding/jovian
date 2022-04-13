import React, { useCallback, useState } from "react";
import useAccount from "hooks/useAccount";
import { Button, FormControlLabel, Typography } from "@mui/material";
import { IStepProps } from "../types";
import { Alert } from "@mui/material";
import { NavLink } from "react-router-dom";
import RememberMeCheckbox from "views/Login/components/RememberMeCheckbox";
import useLocalStorage from "hooks/useLocalStorage";

const DisplayAccountStep: React.FC<IStepProps> = ({ stepForwardFn }) => {
  const { accountRs, flushFn } = useAccount();
  const [userRememberState, setUserRememberState] = useState<boolean>(false);
  const [accounts, setAccounts] = useLocalStorage<Array<string>>("accounts", []); // stores user accounts in localStorage under "accounts" key

  const handleClick = useCallback(() => {
    if (accountRs === undefined) {
      console.error("No accountRs present, something went wrong with account generation.");
      return;
    }

    if (userRememberState) {
      // address has not been previously saved
      if (!accounts?.includes(accountRs)) {
        const newAccounts = [...accounts, accountRs];
        setAccounts(newAccounts);
      }
    }

    // flush the seed words from state as they are  no longer needed and could be a security risk if kept
    if (flushFn !== undefined) flushFn();
  }, [accountRs, accounts, setAccounts, userRememberState, flushFn]);

  const fetchUserRememberState = useCallback((isRememberedStatus: boolean) => {
    setUserRememberState(isRememberedStatus);
  }, []);

  return (
    <>
      {/* TODO: convert alerts to checkboxes to require the user to ack */}
      <Typography>Here is your Jupiter address: {accountRs}</Typography>
      <Alert>You can give your Jupiter address to others so they can send you Jupiter!</Alert>
      <Alert severity="warning">
        Anyone can see your account based on your Jupiter address, but <strong>your seed words must remain private</strong> or others will be able to
        spend your funds.
      </Alert>
      <FormControlLabel control={<RememberMeCheckbox fetchIsRememberedFn={fetchUserRememberState} />} label="Remember Account?" />
      <NavLink to="/dashboard">
        <Button size="large" onClick={handleClick} variant="contained">
          Go To Dashboard
        </Button>
      </NavLink>
    </>
  );
};

export default React.memo(DisplayAccountStep);
