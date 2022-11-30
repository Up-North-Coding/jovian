import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Autocomplete, Button, FormControlLabel, FormGroup, InputProps, Stack, styled, TextField } from "@mui/material";
import { NavLink } from "react-router-dom";
import Logo from "components/Logo";
import ExistingUserDecideButtonGroup from "./components/ExistingUserDecideButtonGroup";
import OnboardingStepper from "./components/OnboardingStepper";
import RememberMeCheckbox from "./components/RememberMeCheckbox";
import ExistingUserTypeButtonGroup from "./components/ExistingUserTypeButtonGroup";
import useLocalStorage from "hooks/useLocalStorage";
import useAccount from "hooks/useAccount";
import { isValidAddress, isValidSecret } from "utils/validation";
import { useSnackbar } from "notistack";
import { messageText } from "utils/common/messages";
import { getAccountRsFromSecretPhrase } from "utils/wallet";

// TODO:
// [ ] Add some sort of templating (JUP-____) or uppercase() to entry box (uppercase has proven annoying)

const autocompleteSx = {
  padding: "16px",
  minWidth: "200px",
  maxWidth: "600px",
  width: "100%",
};

export interface IAddressInputProps extends InputProps {
  localStorageAccounts: Array<string>;
  onInputChange: (value: string | null) => void;
  placeholderText: string;
}

const AddressInput: React.FC<IAddressInputProps> = ({ localStorageAccounts, value, onInputChange, placeholderText }) => (
  <StyledAutocomplete
    sx={autocompleteSx}
    value={value}
    freeSolo
    disablePortal
    onChange={(e, value) => onInputChange(value as string)}
    options={localStorageAccounts}
    renderInput={(params) => <TextField onChange={(e) => onInputChange(e.target.value)} {...params} label={placeholderText} />}
  />
);

const Login: React.FC = () => {
  const { flushFn, userLogin } = useAccount();
  const [accounts, setAccounts] = useLocalStorage<Array<string>>("accounts", []); // Stores user accounts in localStorage under "accounts" key
  const [existingUser, setExistingUser] = useState<"existing" | "new">("new");
  const [existingUserType, setExistingUserType] = useState<"address" | "secretPhrase">("address");
  const [userInputAccount, setUserInputAccount] = useState<string>("");
  const [isValidInputState, setIsValidInputState] = useState<boolean>(false);
  const [userRememberState, setUserRememberState] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleAddressOrSecretInput = useCallback(
    (newValue: string | null) => {
      if (newValue === null) {
        return;
      }
      setUserInputAccount(newValue);

      if (existingUserType === "address") {
        if (!isValidAddress(newValue)) {
          setIsValidInputState(false);
          return;
        } else {
          setIsValidInputState(true);
        }
      } else if (existingUserType === "secretPhrase") {
        if (!isValidSecret(newValue)) {
          enqueueSnackbar(messageText.validation.secretLengthWarning, { variant: "warning" });
          setIsValidInputState(true); // we still allow the user to login after showing them a warning
          return;
        } else {
          setIsValidInputState(true);
        }
      }
    },
    [enqueueSnackbar, existingUserType]
  );

  const handleExistingUserChoiceFn = useCallback(() => {
    setExistingUser((prev) => (prev === "new" ? "existing" : "new"));
  }, []);

  const handleExistingUserTypeChoiceFn = useCallback(() => {
    setExistingUserType((prev) => (prev === "secretPhrase" ? "address" : "secretPhrase"));
  }, []);

  const handleAddressBasedLogin = useCallback(
    (e) => {
      // Address is NOT valid
      if (!isValidAddress(userInputAccount)) {
        e.preventDefault(); // Prevents navigation to Dashboard
        setIsValidInputState(false);
        return;
      }
    },
    [userInputAccount]
  );

  const handleSecretPhraseBasedLogin = useCallback(
    (e) => {
      console.log("inside login, existingUserType is set right, about to test secret:", userInputAccount);
      if (!isValidSecret(userInputAccount)) {
        console.log("invalid secret!");
        e.preventDefault(); // Prevents navigation to Dashboard
        setIsValidInputState(false);
        return;
      }
      console.log("fetching accountRs from secret...");
    },
    [userInputAccount]
  );

  /*
   * If the user has selected the "remember me" checkbox this will save their input entry in localStorage
   * Otherwise just validates their address and proceeds them to the dashboard
   */
  const handleLogin = useCallback(
    (e) => {
      let accountRs = "";
      if (existingUserType === "address") {
        handleAddressBasedLogin(e);
        accountRs = userInputAccount; // it's an account/address style login, so directly set the account
      } else if (existingUserType === "secretPhrase") {
        handleSecretPhraseBasedLogin(e);
        accountRs = getAccountRsFromSecretPhrase(userInputAccount); // it's a secret phrase login type, so convert the secret to an account format
      }
      setIsValidInputState(true); // It's known to be valid now

      // User wants to remember the address
      if (userRememberState) {
        // Address has not been previously saved
        if (!accounts.includes(accountRs)) {
          setAccounts([...accounts, accountRs]);
        }
      }

      /*
       * Flush the seed from state, we no longer use it and keeping it could be a security risk
       */
      if (flushFn !== undefined) {
        flushFn();
      }

      if (!accountRs) {
        return;
      }

      if (userLogin !== undefined) {
        userLogin(accountRs);
      }
    },
    [
      existingUserType,
      userRememberState,
      flushFn,
      userLogin,
      handleAddressBasedLogin,
      userInputAccount,
      handleSecretPhraseBasedLogin,
      accounts,
      setAccounts,
    ]
  );

  const fetchRemembered = useCallback((isRememberedStatus: boolean) => {
    setUserRememberState(isRememberedStatus);
  }, []);

  const validAddressDisplay = useMemo(
    () => (
      <FormGroup sx={{ alignItems: "center" }} row={isValidInputState}>
        <FormControlLabel control={<RememberMeCheckbox fetchIsRememberedFn={fetchRemembered} />} label="Remember Account?" />
        {isValidInputState ? (
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
    [fetchRemembered, handleLogin, isValidInputState, userInputAccount]
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

    if (window.location.href !== "nodes.jup.io") {
      enqueueSnackbar(messageText.critical.mitm, { variant: "error" });
    }
  }, [accounts, enqueueSnackbar]);

  const IsNewUserMemo = useMemo(() => {
    return existingUser === "new" ? (
      <OnboardingStepper />
    ) : (
      <>
        <AddressInput
          placeholderText={existingUserType === "address" ? "Enter Address" : "Enter Secret"}
          onInputChange={handleAddressOrSecretInput}
          localStorageAccounts={accounts !== undefined ? accounts : ["No Accounts"]}
        />
        {validAddressDisplay}
      </>
    );
  }, [accounts, existingUser, existingUserType, handleAddressOrSecretInput, validAddressDisplay]);

  return (
    <StyledPageWrapper>
      <Logo width="200px" padding="20px 0px" />
      <Stack direction="row">
        <ExistingUserDecideButtonGroup value={existingUser} onChange={() => handleExistingUserChoiceFn()} />
        {existingUser === "existing" && <ExistingUserTypeButtonGroup value={existingUserType} onChange={() => handleExistingUserTypeChoiceFn()} />}
      </Stack>
      {IsNewUserMemo}
    </StyledPageWrapper>
  );
};

const StyledPageWrapper = styled("div")(({ theme }) => ({
  alignItems: "center",
  boxSizing: "border-box",
  background: theme.palette.primary.dark,
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  color: "#fff",
  paddingBottom: "150px",
}));

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
