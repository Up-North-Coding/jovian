import React, { useCallback, useState } from "react";
import Page from "components/Page";
import ExistingUserDecideButtonGroup from "./components/ExistingUserDecideButtonGroup";
import Logo from "components/Logo";
import AddressInput from "./components/AddressInput";
import OnboardingStepper from "./components/OnboardingStepper";
import { Button } from "@mui/material";

import getAccount from "utils/api/getAccount";
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

// if no session is found, display the ExistingUserDecideButtonGroup so the user can pick new/existing
const Login: React.FC = () => {
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [localStorage, setLocalStorage] = useState(false); // TODO: add local storage hook from other project

  const handleExistingUserChoiceFn = useCallback((newChoice: string) => {
    getAccount("JUP-4M77-YCUD-979U-GQUQE");
    if (newChoice === "new") {
      setIsExistingUser(true);
    } else {
      setIsExistingUser(false);
    }
  }, []);

  return (
    <Page>
      <Logo />
      <ExistingUserDecideButtonGroup toggleFn={handleExistingUserChoiceFn} />
      {localStorage ? <AddressInput /> : <></>}
      {isExistingUser ? (
        <OnboardingStepper />
      ) : (
        <>
          <AddressInput />
          <Button>Login</Button>
        </>
      )}
    </Page>
  );
};

export default React.memo(Login);
