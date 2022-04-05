import React, { useCallback, useEffect, useMemo, useState } from "react";
import Page from "components/Page";
import ExistingUserDecideButtonGroup from "./components/ExistingUserDecideButtonGroup";
import Logo from "components/Logo";
import OnboardingStepper from "./components/OnboardingStepper";
import { Autocomplete, Button, Checkbox, FormControlLabel, FormGroup, InputProps, TextField } from "@mui/material";
import useLocalStorage from "hooks/useLocalStorage";
import { NavLink } from "react-router-dom";

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
  // const [value, setValue] = useState("");

  return (
    <Autocomplete
      sx={autocompleteSx}
      value={value}
      freeSolo
      disablePortal
      onChange={(e, value) => inputOnChangeFn(value)}
      options={localStorageAccounts}
      renderInput={(params: any) => <TextField onChange={(e) => inputOnChangeFn(e.target.value)} {...params} label="Enter Account" />}
    />
  );
};

const Login: React.FC = () => {
  const [isExistingUser, setIsExistingUser] = useState<boolean>(false);
  const [isRemembered, setIsRemembered] = useState<boolean>(false);
  const [accounts, setAccounts] = useLocalStorage<Array<string>>("accounts", []); // stores user accounts in localStorage under "accounts" key
  const [userInputAccount, setUserInputAccount] = useState<string>("");

  const handleInputChange = useCallback((newValue: string | null) => {
    if (newValue === null) {
      return;
    }

    // TODO: Add formatting to address entry
    // - Auto uppercase
    // - 'JUP-' prefixing and hyphens at appropriate positions
    //
    // if (newValue.length > 2) {
    //   newValue += "-";
    // }
    setUserInputAccount(newValue);
  }, []);

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
      if (isValidAddress(userInputAccount)) {
        const newAccounts = [...accounts, userInputAccount];
        console.log("preparing to save newAccounts:", newAccounts);
        setAccounts(newAccounts);
        return;
      }
      console.error("invalid address entered");
      // TODO: need to improve the behavior here, it shouldn't proceed to take them to the dashboard
    }
  }, [isRemembered, setAccounts, accounts, userInputAccount]);

  return (
    <Page>
      <Logo />
      <ExistingUserDecideButtonGroup toggleFn={handleExistingUserChoiceFn} />
      {isExistingUser ? (
        <OnboardingStepper />
      ) : (
        <>
          <AddressInput inputOnChangeFn={handleInputChange} localStorageAccounts={accountList !== undefined ? accountList : ["No Accounts"]} />
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

//
// Helper Functions
//

// currently performs basic format checking, should be extended to support the JUP characters actually used in the NXT standards
function isValidAddress(address: string) {
  // TODO: confirm all letters get used, this currently validates for general structure but not any NXT/JUP standardization
  const JUPREGEX = /^JUP-\w{4}-\w{4}-\w{4}-\w{5}$/;

  if (address.match(JUPREGEX)) {
    return true;
  }
  return false;
}

export default React.memo(Login);
