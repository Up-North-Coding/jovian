import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Autocomplete, Button, FormControlLabel, FormGroup, InputProps, styled, TextField } from "@mui/material";
import { NavLink } from "react-router-dom";
import Page from "components/Page";
import Logo from "components/Logo";
import ExistingUserDecideButtonGroup from "./components/ExistingUserDecideButtonGroup";
import OnboardingStepper from "./components/OnboardingStepper";
import RememberMeCheckbox from "./components/RememberMeCheckbox";
import useLocalStorage from "hooks/useLocalStorage";
import useAccount from "hooks/useAccount";
import { isValidAddress } from "utils/validation";

// TODO:
// [x] Change existing account entry account so red warning only shows after user starts typing
// [x] Get local storage working for account storage
// [x] Add "back" button so user can move backward in the new user onboarding process
// [x] Fix the regen/copy button group in mobile size
// [x] Fix the "Generate Wallet" button in mobile size
// [x] Make regenerate / copy seed buttons larger for mobile if possible
// [x] Fix toggle button behavior
// [x] Fix the bug with re-entry where after all 12 words are entered you're allowed to continue (even if they're wrong) if they've been previously entered correctly.
// [x] Fix the bug with the duplicate re-entry of seeds
// [x] Block the user from accessing the other views if they aren't logged in
// [ ] Add some sort of templating (JUP-____) or uppercase() to entry box (uppercase has proven annoying)

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

  <StyledAutocomplete
    sx={autocompleteSx}
    value={value}
    freeSolo
    disablePortal
    onChange={(e, value) => inputOnChangeFn(value as string)}
    options={localStorageAccounts}
    renderInput={(params) => <TextField onChange={(e) => inputOnChangeFn(e.target.value)} {...params} label="Enter Account" />}
  />
);

const Login: React.FC = () => {
  const { flushFn, userLogin } = useAccount();
  const [accounts, setAccounts] = useLocalStorage<Array<string>>("accounts", []); // Stores user accounts in localStorage under "accounts" key
  const [existingUser, setExistingUser] = useState<"existing" | "new">("new");
  const [userInputAccount, setUserInputAccount] = useState<string>("");
  const [isValidAddressState, setIsValidAddressState] = useState<boolean>(false);
  const [userRememberState, setUserRememberState] = useState<boolean>(false);
  /*
   * UseEffect(() => {
   *   Console.log("valid?:", isValidAddressState);
   * }, [isValidAddressState]);
   */

  const handleAddressInput = useCallback((newValue: string | null) => {
    if (newValue === null) {
      return;
    }

    if (!isValidAddress(newValue)) {
      setIsValidAddressState(false);
    } else {
      setIsValidAddressState(true);
    }

    setUserInputAccount(newValue);

    /*
     * TODO: Add formatting to address entry
     * - Auto uppercase
     * - 'JUP-' prefixing and hyphens at appropriate positions
     *
     * if (newValue.length > 2) {
     *   newValue += "-";
     * }
     */
  }, []);
  const handleExistingUserChoiceFn = useCallback(() => {
    setExistingUser((prev) => (prev === "new" ? "existing" : "new"));
  }, []);
  /*
   * If the user has selected the "remember me" checkbox this will save their input entry in localStorage
   * Otherwise just validates their address and proceeds them to the dashboard
   */
  const handleLogin = useCallback(
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
  );
  const fetchRemembered = useCallback((isRememberedStatus: boolean) => {
    setUserRememberState(isRememberedStatus);
  }, []);
  const validAddressDisplay = useMemo(
    () => (
      <FormGroup sx={{ alignItems: "center" }} row={isValidAddressState}>
        <FormControlLabel control={<RememberMeCheckbox fetchIsRememberedFn={fetchRemembered} />} label="Remember Account?" />
        {isValidAddressState ? (
          // TODO: check if nvlink takes an onclick that we can use, the current method implies navlink is passing down onClick
          <NavLink to="/dashboard">
            <Button variant="green" onClick={(e) => handleLogin(e)}>
              Login
            </Button>
          </NavLink>
        ) : userInputAccount ? (
          <StyledAlert severity="error">Invalid address format, please check your address and re-enter it.</StyledAlert>
        ) : (
          <></>
        )}
      </FormGroup>
    ),
    [fetchRemembered, handleLogin, isValidAddressState, userInputAccount]
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
      <Logo width="200px" padding="20px 0px" />
      <ExistingUserDecideButtonGroup value={existingUser} onChange={() => handleExistingUserChoiceFn()} />
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

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    padding: "40px 40px",
  },
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    padding: "0px 10px",
    margin: "20px 40px",
  },
}));

export default memo(Login);
