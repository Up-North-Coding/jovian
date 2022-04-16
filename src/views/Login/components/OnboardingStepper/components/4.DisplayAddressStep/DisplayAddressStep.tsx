import React, { memo, useCallback, useMemo, useState } from "react";
import useAccount from "hooks/useAccount";
import { Alert, Button, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { IStepProps } from "../types";
import { NavLink } from "react-router-dom";
import RememberMeCheckbox from "views/Login/components/RememberMeCheckbox";
import useLocalStorage from "hooks/useLocalStorage";

interface IUserNoticeGroupProps {
  fetchUnderstandStatusFn: (userUnderstandArray: boolean) => void;
}

const UserNoticeGroup: React.FC<IUserNoticeGroupProps> = ({ fetchUnderstandStatusFn }) => {
    const [userUnderstandCheckboxStatus, setUserUnderstandCheckboxStatus] = useState<Array<boolean>>([false, false]),
      handleUserUnderandCheck = useCallback(
        (newState: boolean, checkboxId: number) => {
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
        },
        [fetchUnderstandStatusFn]
      );

    return (
      <>
        <Alert>
          <Checkbox onChange={(e) => handleUserUnderandCheck(e.target.checked, 0)} />
          You can give your Jupiter address to others so they can send you Jupiter!
        </Alert>

        <Alert severity="warning">
          <Checkbox onChange={(e) => handleUserUnderandCheck(e.target.checked, 1)} />
          Anyone can see your account based on your Jupiter address, but <strong>your seed words must remain private</strong> or others will be able
          to spend your funds.
        </Alert>
      </>
    );
  },
  DisplayAccountStep: React.FC<IStepProps> = () => {
    const { accountRs, flushFn } = useAccount(),
      [userRememberState, setUserRememberState] = useState<boolean>(false),
      [userUnderstandState, setUserUnderstandState] = useState<boolean>(false),
      [accounts, setAccounts] = useLocalStorage<Array<string>>("accounts", [] as Array<string>), // Stores user accounts in localStorage under "accounts" key
      handleLogin = useCallback(
        (e) => {
          if (accountRs === undefined) {
            console.error("No accountRs present, something went wrong with account generation.");
            alert("Account generation has malfunctioned, please try again and report to the maintainer if the issue continues.");
            e.preventDefault();
            return;
          }

          // User hasn't acked both confirm boxes yet
          if (!userUnderstandState) {
            e.preventDefault();
            return;
          }

          console.log("checking if user wants to remember...", userRememberState);
          if (userRememberState) {
            console.log("user wants to remember...");
            // Address has not been previously saved
            if (!accounts.includes(accountRs)) {
              const newAccounts = [...accounts, accountRs];
              console.log("setting new accounts:", newAccounts);
              setAccounts(newAccounts);
            }
          }

          // Flush the seed words from state as they are  no longer needed and could be a security risk if kept
          if (flushFn !== undefined) {
            flushFn();
          }
        },
        [accountRs, accounts, setAccounts, userRememberState, flushFn, userUnderstandState]
      ),
      fetchUserRememberState = useCallback((isRememberedStatus: boolean) => {
        console.log("setting remember status:", isRememberedStatus);
        setUserRememberState(isRememberedStatus);
      }, []),
      fetchUserUnderstandState = useCallback((userUnderstands: boolean) => {
        setUserUnderstandState(userUnderstands);
      }, []),
      UnderstandMemo = useMemo(() => {
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
      }, [handleLogin, userUnderstandState]);

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

/*
 *
 * Helper functions
 *
 */

/*
 * Takes in an array of understand checkbox status' as well as a fetcher function that needs to know the overall status
 * and it returns a single bool
 */
function setOverallUnderstandStatus(statusArray: Array<boolean>, fetchFn: (status: boolean) => void) {
  // All items are true
  if (statusArray.every((element) => element === true)) {
    fetchFn(true);
    return;
  }
  fetchFn(false);
}

export default memo(DisplayAccountStep);
