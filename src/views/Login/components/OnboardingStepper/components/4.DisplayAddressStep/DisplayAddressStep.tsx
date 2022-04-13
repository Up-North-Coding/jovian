import React, { useCallback, useMemo, useState } from "react";
import useAccount from "hooks/useAccount";
import { Button, Checkbox, CheckboxProps, FormControlLabel, Tooltip, Typography } from "@mui/material";
import { IStepProps } from "../types";
import { Alert } from "@mui/material";
import { NavLink } from "react-router-dom";
import RememberMeCheckbox from "views/Login/components/RememberMeCheckbox";
import useLocalStorage from "hooks/useLocalStorage";
import userEvent from "@testing-library/user-event";

interface IUserNoticeGroupProps {
  fetchUnderstandStatusFn: (userUnderstandArray: boolean) => void;
}

const UserNoticeGroup: React.FC<IUserNoticeGroupProps> = ({ fetchUnderstandStatusFn }) => {
  const [userUnderstandCheckboxStatus, setUserUnderstandCheckboxStatus] = useState<Array<boolean>>([false, false]);

  const handleUserUnderandCheck = useCallback((newState: boolean, checkboxId: number) => {
    setUserUnderstandCheckboxStatus((prev) => {
      console.log("handling new click", "newState:", newState, "checkboxId:", checkboxId, "prev:", prev);
      let newArray: Array<boolean>;
      if (checkboxId === 0) {
        newArray = [newState, prev[1]];
      } else {
        newArray = [prev[0], newState];
      }
      setOverallUnderstandStatus(newArray, fetchUnderstandStatusFn);
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

      // user hasn't acked both confirm boxes yet
      if (!userUnderstandState) {
        e.preventDefault();
        return;
      }

      console.log("checking if user wants to remember...");
      if (userRememberState) {
        console.log("user wants to remember...");
        // address has not been previously saved
        if (!accounts.includes(accountRs)) {
          const newAccounts = [...accounts, accountRs];
          console.log("setting new accounts:", newAccounts);
          setAccounts(newAccounts);
        }
      }

      // flush the seed words from state as they are  no longer needed and could be a security risk if kept
      if (flushFn !== undefined) flushFn();
    },
    [accountRs, accounts, setAccounts, userRememberState, flushFn, userUnderstandState]
  );

  const fetchUserRememberState = useCallback((isRememberedStatus: boolean) => {
    setUserRememberState(isRememberedStatus);
  }, []);

  const fetchUserUnderstandState = useCallback(
    (userUnderstands: boolean) => {
      setUserUnderstandState(userUnderstands);
    },
    [userUnderstandState]
  );

  useMemo(() => {
    console.log(userRememberState);
  }, [userRememberState]);

  const UnderstandMemo = useMemo(() => {
    if (userUnderstandState) {
      return (
        <NavLink to="/dashboard">
          <Button size="large" onClick={(e) => handleLogin(e)} variant="contained">
            Go To Dashboard
          </Button>
        </NavLink>
      );
    }

    return <Typography>You must acknowledge the alert messages above before you can proceed</Typography>;
  }, [userUnderstandState]);

  return (
    <>
      {/* TODO: convert alerts to checkboxes to require the user to ack */}
      <Typography>Here is your Jupiter address: {accountRs}</Typography>

      <UserNoticeGroup fetchUnderstandStatusFn={fetchUserUnderstandState} />
      <FormControlLabel control={<RememberMeCheckbox fetchIsRememberedFn={fetchUserRememberState} />} label="Remember Account?" />
      {UnderstandMemo}
    </>
  );
};

//
// Helper functions
//

// takes in an array of understand checkbox status' as well as a fetcher function that needs to know the overall status
// and it returns a single bool
function setOverallUnderstandStatus(statusArray: Array<boolean>, fetchFn: Function) {
  // all items are true
  if (statusArray.every((element) => element === true)) {
    fetchFn(true);
    return;
  }
  fetchFn(false);
}

export default React.memo(DisplayAccountStep);
