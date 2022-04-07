import React, { useState } from "react";
import Page from "components/Page";
import ExistingUserDecideButtonGroup from "./components/ExistingUserDecideButtonGroup";
import Logo from "components/Logo";
import AddressInput from "./components/AddressInput";
import OnboardingStepper from "./components/OnboardingStepper";
import { Button } from "@mui/material";

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

const JUPLogo = () => {
  return (
    <>
      <Logo />
    </>
  );
};

// if no session is found, display the ExistingUserDecideButtonGroup so the user can pick new/existing
const Login: React.FC = () => {
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [session, setSession] = useState(false); // TODO: get session

  const handleExistingUserChoiceFn = (newChoice: string) => {
    if (newChoice === "new") {
      setIsExistingUser(true);
    } else {
      setIsExistingUser(false);
    }
  };

  return (
    <Page>
      <JUPLogo />
      <ExistingUserDecideButtonGroup toggleFn={handleExistingUserChoiceFn} />
      {session ? <AddressInput /> : <></>}
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
