import React, { useCallback, useMemo, useState } from "react";
import useAccount from "hooks/useAccount";
import { Button, Checkbox, CheckboxProps, FormControlLabel, Typography } from "@mui/material";
import { IStepProps } from "../types";
import { Alert } from "@mui/material";
import { NavLink } from "react-router-dom";
import RememberMeCheckbox from "views/Login/components/RememberMeCheckbox";
import useLocalStorage from "hooks/useLocalStorage";

interface IUserNoticeGroupProps {
  fetchUnderstandStatusFn: (userUnderstandArray: Array<boolean>) => void;
}

const UserNoticeGroup: React.FC<IUserNoticeGroupProps> = ({ fetchUnderstandStatusFn }) => {
  const [userUnderstandCheckboxStatus, setUserUnderstandCheckboxStatus] = useState<Array<boolean>>([false, false]);

  const handleUserUnderandCheck = useCallback((newState: boolean, checkboxId: number) => {
    let newArray: Array<boolean>;
    //set user ack status for two different checkboxes
    if (checkboxId === 0) {
      setUserUnderstandCheckboxStatus((prev) => {
        newArray = [newState, prev[1]];
        fetchUnderstandStatusFn(newArray);

        return newArray;
      });
      return;
    }
    setUserUnderstandCheckboxStatus((prev) => {
      newArray = [prev[0], newState];
      fetchUnderstandStatusFn(newArray);
      return newArray;
    });
  }, []);

  return (
    <>
      <Alert>
        <Checkbox onChange={(e) => handleUserUnderandCheck(e.target.checked, 0)} />
        You can give your Jupiter address to others so they can send you Jupiter!
      </Alert>

      <Alert severity="warning">
        <Checkbox onChange={(e) => handleUserUnderandCheck(e.target.checked, 1)} />
        Anyone can see your account based on your Jupiter address, but <strong>your seed words must remain private</strong> or others will be able to
        spend your funds.
      </Alert>
    </>
  );
};

const DisplayAccountStep: React.FC<IStepProps> = () => {
  const { accountRs, flushFn } = useAccount();
  const [userRememberState, setUserRememberState] = useState<boolean>(false);
  const [userUnderstandState, setUserUnderstandState] = useState<boolean>(false);

  const [accounts, setAccounts] = useLocalStorage<Array<string>>("accounts", []); // stores user accounts in localStorage under "accounts" key

  const handleLogin = useCallback(
    (e) => {
      if (accountRs === undefined) {
        console.error("No accountRs present, something went wrong with account generation.");
        alert("Account generation has malfunctioned, please try again and report to the maintainer if the issue continues.");
        e.preventDefault();
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
    },
    [accountRs, accounts, setAccounts, userRememberState, flushFn]
  );

  const fetchUserRememberState = useCallback((isRememberedStatus: boolean) => {
    setUserRememberState(isRememberedStatus);
  }, []);

  // Debug
  useMemo(() => {
    console.log(userRememberState);
  }, [userRememberState]);

  // could I have a useMemo for (isUnderstanding) which is set from the UserNoticeGroup, so the UserNoticeGroup will
  // perform the logic and return a single bool?
  const fetchUserUnderstandState = useCallback((userUnderstandArray: Array<boolean>) => {
    // all items are true
    if (userUnderstandArray.every((element) => element === true)) {
      console.log("all items true, user may proceed");
      setUserUnderstandState(true);
      return;
    }
    console.log("setting false");
    setUserUnderstandState(false);
  }, []);

  return (
    <>
      {/* TODO: convert alerts to checkboxes to require the user to ack */}
      <Typography>Here is your Jupiter address: {accountRs}</Typography>

      <UserNoticeGroup fetchUnderstandStatusFn={fetchUserUnderstandState} />
      <FormControlLabel control={<RememberMeCheckbox fetchIsRememberedFn={fetchUserRememberState} />} label="Remember Account?" />
      <NavLink to="/dashboard">
        <Button size="large" onClick={(e) => handleLogin(e)} variant="contained" disabled={userRememberState}>
          Go To Dashboard
        </Button>
      </NavLink>
    </>
  );
};

export default React.memo(DisplayAccountStep);
