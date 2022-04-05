import React, { useCallback, useMemo, useState } from "react";
import Page from "components/Page";
import ExistingUserDecideButtonGroup from "./components/ExistingUserDecideButtonGroup";
import Logo from "components/Logo";
import AddressInput from "./components/AddressInput";
import OnboardingStepper from "./components/OnboardingStepper";
import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

// import getAccount from "utils/api/getAccount";
import useLocalStorage from "hooks/useLocalStorage";
import { NavLink } from "react-router-dom";
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

const Login: React.FC = () => {
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isRemembered, setIsRemembered] = useState(false);
  const [accounts, setAccounts] = useLocalStorage<Array<string>>("accounts", []); // stores user accounts in localStorage under "accounts" key

  // keeps the dropdown menu options populated as localStorage changes
  const accountList = useMemo(() => {
    if (accounts === undefined) {
      return;
    }
    return accounts;
  }, [accounts]);

  const handleExistingUserChoiceFn = useCallback((newChoice: string) => {
    if (newChoice === "new") {
      setIsExistingUser(true);
    } else {
      setIsExistingUser(false);
    }
  }, []);

  const handleRememberAccount = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsRemembered(event.target.checked);
    },
    [setIsRemembered]
  );

  // if the user has selected the "remember me" checkbox this will save their input entry in localStorage
  // otherwise does nothing
  const handleLogin = useCallback(() => {
    if (isRemembered) {
      const newAccounts = [...accounts, "test string"];
      console.log("preparing to save newAccounts:", newAccounts);
      setAccounts(newAccounts);
    }
  }, [isRemembered, setAccounts, accounts]);

  // I have the Input keeping track of its own state (value)
  // I have a button outside of that component
  // When I click the button, I want to do something with the Input's value
  return (
    <Page>
      <Logo />
      <ExistingUserDecideButtonGroup toggleFn={handleExistingUserChoiceFn} />
      {isExistingUser ? (
        <OnboardingStepper />
      ) : (
        <>
          <AddressInput localStorageAccounts={accountList !== undefined ? accountList : ["No Accounts"]} />
          <FormGroup>
            <FormControlLabel control={<Checkbox checked={isRemembered} onChange={handleRememberAccount} />} label="Remember Account?" />
            <NavLink to="/dashboard">
              <Button variant="contained" onClick={() => handleLogin()}>
                Login
              </Button>
            </NavLink>
          </FormGroup>
        </>
      )}
    </Page>
  );
};

export default React.memo(Login);
