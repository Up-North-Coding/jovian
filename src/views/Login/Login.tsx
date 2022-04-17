import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import Page from "components/Page";
import ExistingUserDecideButtonGroup from "./components/ExistingUserDecideButtonGroup";
import Logo from "components/Logo";
import OnboardingStepper from "./components/OnboardingStepper";
import { Alert, Autocomplete, Button, FormControlLabel, FormGroup, InputProps, TextField } from "@mui/material";
import useLocalStorage from "hooks/useLocalStorage";
import { NavLink } from "react-router-dom";
import RememberMeCheckbox from "./components/RememberMeCheckbox";
import useAccount from "hooks/useAccount";
import { isValidAddress } from "utils/validation";

/*
 * TODO: Change existing account entry account so red warning only shows after user starts typing
 * TODO: Add some sort of templating (JUP-____) or uppercase() to entry box
 * TODO: Style understand check boxes to make them look better
 * TODO: Add "back" button so user can move backward in the new user onboarding process
 */

// Import getAccount from "utils/api/getAccount";

const autocompleteSx = {
  padding: "16px",
  minWidth: "200px",
  maxWidth: "600px",
  width: "100%",
};

export interface IInputOptions extends InputProps {
  localStorageAccounts: Array<string>;
  inputOnChangeFn: (value: string | null) => void;
}

const AddressInput: React.FC<IInputOptions> = ({ localStorageAccounts, value, inputOnChangeFn }) => (
    /*
     * TODO: Add autosuggest-highlight? It's a small custom package which requires some additional renderOptions
     * https://mui.com/material-ui/react-autocomplete/#Highlights.tsx
     */

    <Autocomplete
      sx={autocompleteSx}
      value={value}
      freeSolo
      disablePortal
      onChange={(e, value) => inputOnChangeFn(value as string)}
      options={localStorageAccounts}
      renderInput={(params) => <TextField onChange={(e) => inputOnChangeFn(e.target.value)} {...params} label="Enter Account" />}
    />
  ),
  Login: React.FC = () => {
    const { flushFn, userLogin } = useAccount(),
      [existingUser, setExistingUser] = useState<"existing" | "new">("new"),
      [accounts, setAccounts] = useLocalStorage<Array<string>>("accounts", []), // Stores user accounts in localStorage under "accounts" key
      [userInputAccount, setUserInputAccount] = useState<string>(""),
      [isValidAddressState, setIsValidAddressState] = useState<boolean>(false),
      [userRememberState, setUserRememberState] = useState<boolean>(false),
      /*
       * UseEffect(() => {
       *   Console.log("valid?:", isValidAddressState);
       * }, [isValidAddressState]);
       */

      handleAddressInput = useCallback((newValue: string | null) => {
        if (newValue === null) {
          return;
        }

        if (!isValidAddress(newValue)) {
          // Console.log("invalid", newValue);
          setIsValidAddressState(false);
        } else {
          // Console.log("valid", newValue);

          setIsValidAddressState(true);
          setUserInputAccount(newValue);
        }

        /*
         * TODO: Add formatting to address entry
         * - Auto uppercase
         * - 'JUP-' prefixing and hyphens at appropriate positions
         *
         * if (newValue.length > 2) {
         *   newValue += "-";
         * }
         */
      }, []),
      handleExistingUserChoiceFn = useCallback((newChoice: "new" | "existing") => {
        setExistingUser(newChoice);
      }, []),
      /*
       * If the user has selected the "remember me" checkbox this will save their input entry in localStorage
       * Otherwise just validates their address and proceeds them to the dashboard
       */
      handleLogin = useCallback(
        (e) => {
          // Address is NOT valid
          if (!isValidAddress(userInputAccount)) {
            e.preventDefault(); // Prevents navigation to Dashboard
            setIsValidAddressState(false);
            return;
          }
          setIsValidAddressState(true); // It's known to be valid now

          // User wants to remember the address
          if (userRememberState) {
            // Address has not been previously saved
            if (!accounts.includes(userInputAccount)) {
              setAccounts([...accounts, userInputAccount]);
            }
          }

          /*
           * Flush the seed from state, we no longer use it and keeping it could be a security risk
           * Because this is Existing user flow, a seed isn't likely to exist here but a user could generate a
           * New account and then back all the way out and take the existing user route which would potentially get missed otherwise
           */
          if (flushFn !== undefined) {
            flushFn();
          }

          if (userLogin !== undefined) {
            userLogin(userInputAccount);
          }
        },
        [userInputAccount, userRememberState, accounts, setAccounts, flushFn, userLogin]
      ),
      fetchRemembered = useCallback((isRememberedStatus: boolean) => {
        setUserRememberState(isRememberedStatus);
      }, []),
      validAddressDisplay = useMemo(
        () => (
          <FormGroup row={isValidAddressState}>
            <FormControlLabel control={<RememberMeCheckbox fetchIsRememberedFn={fetchRemembered} />} label="Remember Account?" />
            {isValidAddressState ? (
              // TODO: check if nvlink takes an onclick that we can use, the current method implies navlink is passing down onClick
              <NavLink to="/dashboard">
                <Button variant="contained" onClick={(e) => handleLogin(e)}>
                  Login
                </Button>
              </NavLink>
            ) : (
              /*
               * TODO: Invalid address reporting could be improved, there are multiple options
               *   1. Borrow the scheme from the existing login where the input auto-fills the end of the input string with recommended characters "JUP-AB__-____-____-_____" and then don't display a warning until the last character is entered
               *   2. Only show an error when the user clicks login, would require changing how login is currently displayed
               */
              <Alert severity="error">Invalid address format, please check your address and re-enter it.</Alert>
            )}
          </FormGroup>
        ),
        [fetchRemembered, handleLogin, isValidAddressState]
      );

    /*
     * TODO: need to account for the user deleting all of their accounts (once deletion is added)
     * Sets initial existingUser based on current session status
     */
    useEffect(() => {
      if (accounts?.length > 0) {
        setExistingUser("existing");
      } else {
        setExistingUser("new");
      }
    }, [accounts]);

    return (
      <Page>
        <Logo width="200px" />
        <ExistingUserDecideButtonGroup value={existingUser} onChange={(e, val) => handleExistingUserChoiceFn(val)} />
        {existingUser === "new" ? (
          <OnboardingStepper />
        ) : (
          <>
            <AddressInput inputOnChangeFn={handleAddressInput} localStorageAccounts={accounts !== undefined ? accounts : ["No Accounts"]} />
            {validAddressDisplay}
          </>
        )}
      </Page>
    );
};

export default React.memo(Login);
