import React, { useCallback, useMemo, useState } from "react";
import Page from "components/Page";
import ExistingUserDecideButtonGroup from "./components/ExistingUserDecideButtonGroup";
import Logo from "components/Logo";
import OnboardingStepper from "./components/OnboardingStepper";
import { Alert, Autocomplete, Button, Checkbox, FormControlLabel, FormGroup, InputProps, TextField } from "@mui/material";
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
  const [isValidAddressState, setIsValidAddressState] = useState<boolean>(false);

  // useEffect(() => {
  //   console.log("valid?:", isValidAddressState);
  // }, [isValidAddressState]);

  const handleInputChange = useCallback((newValue: string | null) => {
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
  // otherwise just validates their address and proceeds them to the dashboard
  const handleLogin = useCallback(
    (e) => {
      // address is NOT valid
      if (!isValidAddress(userInputAccount)) {
        e.preventDefault(); // prevents navigation to Dashboard
        setIsValidAddressState(false);
      }
      setIsValidAddressState(true); // it's known to be valid now

      // user wants to remember the address
      if (isRemembered) {
        // address has not been previously saved
        if (!accounts.includes(userInputAccount)) {
          const newAccounts = [...accounts, userInputAccount];
          setAccounts(newAccounts);
        }
      }
    },
    [isRemembered, setAccounts, accounts, userInputAccount]
  );

  const validAddressDisplay = useMemo(() => {
    return (
      <FormGroup row={isValidAddressState}>
        <FormControlLabel control={<Checkbox checked={isRemembered} onChange={handleRememberAccount} />} label="Remember Account?" />
        {isValidAddressState ? (
          // TODO: check if nvlink takes an onclick that we can use, the current method implies navlink is passing down onClick
          <NavLink to="/dashboard">
            <Button variant="contained" onClick={(e) => handleLogin(e)}>
              Login
            </Button>
          </NavLink>
        ) : (
          <Alert severity="error">Invalid address format, please check your address and re-enter it.</Alert>
        )}
      </FormGroup>
    );
  }, [handleLogin, handleRememberAccount, isRemembered, isValidAddressState]);

  return (
    <Page>
      <Logo />
      <ExistingUserDecideButtonGroup toggleFn={handleExistingUserChoiceFn} />
      {/* TODO: set this so if there's account storage present we go to Existing, if not we go to New but still allow user to switch */}
      {isExistingUser ? (
        <OnboardingStepper />
      ) : (
        <>
          <AddressInput inputOnChangeFn={handleInputChange} localStorageAccounts={accountList !== undefined ? accountList : ["No Accounts"]} />
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
// TODO: See if breaking the regex into individual hyphenated checks ["JUP", "ABCD", "EFGH-"]
function isValidAddress(address: string) {
  // TODO: confirm all letters get used, this currently validates for general structure but not any NXT/JUP standardization
  const JUPREGEX = /^JUP-\w{4}-\w{4}-\w{4}-\w{5}$/;

  if (address.match(JUPREGEX)) {
    return true;
  }
  return false;
}

export default React.memo(Login);
