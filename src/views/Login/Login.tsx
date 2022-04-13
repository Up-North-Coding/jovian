import React, { useCallback, useEffect, useMemo, useState } from "react";
import Page from "components/Page";
import ExistingUserDecideButtonGroup from "./components/ExistingUserDecideButtonGroup";
import Logo from "components/Logo";
import OnboardingStepper from "./components/OnboardingStepper";
import { Alert, Autocomplete, Button, FormControlLabel, FormGroup, InputProps, TextField } from "@mui/material";
import useLocalStorage from "hooks/useLocalStorage";
import { NavLink } from "react-router-dom";
import RememberMeCheckbox from "./components/RememberMeCheckbox";
import useAccount from "hooks/useAccount";

// import getAccount from "utils/api/getAccount";

/* 
  Component selection considerations (design)

  Autocomplete - Combo Box demo 
    -- Account / seedphrase entry
    -- Account enumeration from session storage
    -- Manual account entry from user

  ToggleButton - exclusive selection demo
    -- New/Existing user
    -- Seedphrase/accountRs login method

  Checkbox - Label demo
    -- User confirmation of seedphrase copy/backup

  Chip - no demo
    -- User seed re-entry

  Text field - Basic TextField demo
    -- Seedphrase presentation / copy box

  Alert 
    -- Seedphrase backup warning

*/

const autocompleteSx = {
  padding: "16px",
  minWidth: "200px",
  maxWidth: "600px",
  width: "100%",
};

export interface IInputOptions extends InputProps {
  localStorageAccounts: Array<string>;
  inputOnChangeFn: Function;
}

const AddressInput: React.FC<IInputOptions> = ({ localStorageAccounts, value, inputOnChangeFn }) => {
  // TODO: Add autosuggest-highlight? It's a small custom package which requires some additional renderOptions
  // https://mui.com/material-ui/react-autocomplete/#Highlights.tsx
  return (
    <Autocomplete
      sx={autocompleteSx}
      value={value}
      freeSolo
      disablePortal
      onChange={(e, value) => inputOnChangeFn(value)}
      options={localStorageAccounts}
      renderInput={(params) => <TextField onChange={(e) => inputOnChangeFn(e.target.value)} {...params} label="Enter Account" />}
    />
  );
};

const Login: React.FC = () => {
  const { flushFn } = useAccount();
  const [existingUser, setExistingUser] = useState<"existing" | "new">("new");
  const [accounts, setAccounts] = useLocalStorage<Array<string>>("accounts", []); // stores user accounts in localStorage under "accounts" key
  const [userInputAccount, setUserInputAccount] = useState<string>("");
  const [isValidAddressState, setIsValidAddressState] = useState<boolean>(false);
  const [userRememberState, setUserRememberState] = useState<boolean>(false);

  // useEffect(() => {
  //   console.log("valid?:", isValidAddressState);
  // }, [isValidAddressState]);

  const handleAddressInput = useCallback((newValue: string | null) => {
    if (newValue === null) {
      return;
    }

    if (!isValidAddress(newValue)) {
      // console.log("invalid", newValue);
      setIsValidAddressState(false);
    } else {
      // console.log("valid", newValue);

      setIsValidAddressState(true);
      setUserInputAccount(newValue);
    }

    // TODO: Add formatting to address entry
    // - Auto uppercase
    // - 'JUP-' prefixing and hyphens at appropriate positions
    //
    // if (newValue.length > 2) {
    //   newValue += "-";
    // }
  }, []);

  const handleExistingUserChoiceFn = useCallback((event: any, newChoice: "new" | "existing") => {
    setExistingUser(newChoice);
  }, []);

  // if the user has selected the "remember me" checkbox this will save their input entry in localStorage
  // otherwise just validates their address and proceeds them to the dashboard
  const handleLogin = useCallback(
    (e) => {
      // address is NOT valid
      if (!isValidAddress(userInputAccount)) {
        e.preventDefault(); // prevents navigation to Dashboard
        setIsValidAddressState(false);
        return;
      }
      setIsValidAddressState(true); // it's known to be valid now

      // user wants to remember the address
      if (userRememberState) {
        // address has not been previously saved
        if (!accounts.includes(userInputAccount)) {
          setAccounts([...accounts, userInputAccount]);
        }
      }

      // flush the seed from state, we no longer use it and keeping it could be a security risk
      // because this is Existing user flow, a seed isn't likely to exist here but a user could generate a
      // new account and then back all the way out and take the existing user route which would potentially get missed otherwise
      if (flushFn !== undefined) {
        flushFn();
      }
    },
    [userInputAccount, userRememberState, accounts, setAccounts, flushFn]
  );

  const fetchRemembered = useCallback((isRememberedStatus: boolean) => {
    setUserRememberState(isRememberedStatus);
  }, []);

  const validAddressDisplay = useMemo(() => {
    return (
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
          // TODO: Invalid address reporting could be improved, there are multiple options
          //   1. Borrow the scheme from the existing login where the input auto-fills the end of the input string with recommended characters "JUP-AB__-____-____-_____" and then don't display a warning until the last character is entered
          //   2. Only show an error when the user clicks login, would require changing how login is currently displayed
          <Alert severity="error">Invalid address format, please check your address and re-enter it.</Alert>
        )}
      </FormGroup>
    );
  }, [fetchRemembered, handleLogin, isValidAddressState]);

  // TODO: need to account for the user deleting all of their accounts (once deletion is added)
  // sets initial existingUser based on current session status
  useEffect(() => {
    if (accounts.length > 0) {
      setExistingUser("existing");
    } else {
      setExistingUser("new");
    }
  }, [accounts]);

  return (
    <Page>
      <Logo />
      <ExistingUserDecideButtonGroup value={existingUser} onChange={handleExistingUserChoiceFn} />
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

//
// Helper Functions
//

// currently performs basic format checking, should be extended to support the JUP characters actually used in the NXT standards
// TODO: See if breaking the regex into individual hyphenated checks ["JUP", "ABCD", "EFGH"] is easier to read/write
function isValidAddress(address: string) {
  // TODO: confirm all letters get used, this currently validates for general structure but not any NXT/JUP standardization
  const JUPREGEX = /^JUP-\w{4}-\w{4}-\w{4}-\w{5}$/;

  if (JUPREGEX.test(address)) {
    return true;
  }
  return false;
}

export default React.memo(Login);
