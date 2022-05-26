import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, DialogContent, Input, InputLabel, Stack, styled, Typography } from "@mui/material";
import JUPDialog from "components/JUPDialog";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import { unitPrecision } from "utils/common/constants";
import { messageText } from "utils/common/messages";
import useAccount from "hooks/useAccount";
import useAPI from "hooks/useAPI";
import Jazzicon from "react-jazzicon";
import { useSnackbar } from "notistack";

// MUST: currently using "balance" but need to use "availableBalance" or similar because
// balances in orders are still included and should not be
const UserInfo: React.FC = () => {
  const [isAccountInfoDisplayed, setIsAccountInfoDisplayed] = useState<boolean>(false);
  const [currentAccountName, setCurrentAccountName] = useState<string>();
  const [currentAccountDescr, setCurrentAccountDescr] = useState<string>();
  const [requestUserSecret, setRequestUserSecret] = useState<boolean>(false);
  const [userSecretInput, setUserSecretInput] = useState<string>("");
  const { setAccountInfo } = useAPI();
  const { accountId, accountRs, accountName, accountDescription, balance } = useAccount();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleSubmit = useCallback(async () => {
    if (setAccountInfo !== undefined) {
      setRequestUserSecret(true);
    }
  }, [setAccountInfo]);

  const handleCloseSeedCollection = useCallback(() => {
    setRequestUserSecret(false);
  }, []);

  const sendCopySuccess = useCallback(() => {
    enqueueSnackbar(messageText.copy.success, { variant: "success" });
  }, [enqueueSnackbar]);

  const sendCopyFailure = useCallback(() => {
    enqueueSnackbar(messageText.copy.failure, { variant: "error" });
  }, [enqueueSnackbar]);

  const handleCopy = useCallback(
    (toCopy: string | undefined) => {
      if (accountRs === undefined || toCopy === undefined) {
        return;
      }
      navigator.clipboard.writeText(toCopy).then(
        () => sendCopySuccess(),
        () => sendCopyFailure()
      );
    },
    [accountRs, sendCopyFailure, sendCopySuccess]
  );

  const handleClose = useCallback(() => {
    setIsAccountInfoDisplayed(false);
  }, []);

  const displayAccountInfo = useCallback(() => {
    setIsAccountInfoDisplayed(true);
  }, []);

  const handleAccountNameInputChange = useCallback((newVal: string) => {
    setCurrentAccountName(newVal);
  }, []);

  const handleAccountDescrInputChange = useCallback((newVal: string) => {
    setCurrentAccountDescr(newVal);
  }, []);

  const handleSecretEntry = useCallback((secretInput) => {
    setUserSecretInput(secretInput);
  }, []);

  const handleSubmitSecret = useCallback(
    async (secret: string) => {
      let result;
      if (setAccountInfo !== undefined) {
        result = await setAccountInfo(secret, currentAccountName || "", currentAccountDescr || "");
      }

      if (result) {
        enqueueSnackbar(messageText.userInfo.success, { variant: "success" });
        return;
      }
      enqueueSnackbar(messageText.userInfo.failure, { variant: "error" });
      console.log("send result:", result);
    },
    [currentAccountDescr, currentAccountName, enqueueSnackbar, setAccountInfo]
  );

  const DynamicChip = useMemo(() => {
    if (accountId === undefined) {
      return <></>;
    }
    return (
      <AccountAvatarChip label={accountRs} avatar={<Jazzicon diameter={30} seed={parseInt(accountId)} />} onClick={() => handleCopy(accountRs)} />
    );
  }, [accountId, accountRs, handleCopy]);

  // pass the account name (from blockchain) into the state var which updates the input values
  useEffect(() => {
    setCurrentAccountName(accountName);
    setCurrentAccountDescr(accountDescription);
  }, [accountDescription, accountName]);

  const ConditionalSetAccountInfo = useMemo(() => {
    return (
      requestUserSecret && (
        <>
          <JUPDialog isOpen={requestUserSecret} closeFn={handleCloseSeedCollection}>
            <DialogContent>
              <Box sx={{ minWidth: "600px", height: "300px" }}>
                <Typography align="center">Please enter your seed phrase.</Typography>
                <Stack sx={{ alignItems: "center" }}>
                  <SeedphraseEntryBox onChange={(e) => handleSecretEntry(e.target.value)} type="password" placeholder="Enter Seed Phrase" />
                  <ConfirmButton variant="contained" onClick={() => handleSubmitSecret(userSecretInput)}>
                    Confirm & Send
                  </ConfirmButton>
                </Stack>
              </Box>
            </DialogContent>
          </JUPDialog>
        </>
      )
    );
  }, [handleCloseSeedCollection, handleSecretEntry, handleSubmitSecret, requestUserSecret, userSecretInput]);

  const ConditionalAccountInfoDisplay = useMemo(() => {
    return (
      isAccountInfoDisplayed && (
        <>
          <JUPDialog isOpen={isAccountInfoDisplayed} closeFn={handleClose}>
            <DialogContent>
              <Box sx={{ minWidth: "600px", height: "400px" }}>
                <Stack sx={{ width: "90%", alignItems: "center" }}>
                  <Typography align="center">Account Information</Typography>
                  <Typography align="center">
                    Make changes to information below and then click update to save the changes to the blockchain.
                  </Typography>
                  {DynamicChip}
                  <InputLabel>
                    Account Name:
                    <AccountNameDetailed value={currentAccountName} onChange={(e) => handleAccountNameInputChange(e.target.value)} />
                  </InputLabel>
                  <InputLabel>Description</InputLabel>

                  <AccountDescriptionDetailed
                    value={currentAccountDescr}
                    onChange={(e) => handleAccountDescrInputChange(e.target.value)}
                    multiline={true}
                  />
                  <Button variant="contained" onClick={handleSubmit}>
                    Update Account Info
                  </Button>
                </Stack>
              </Box>
            </DialogContent>
          </JUPDialog>
        </>
      )
    );
  }, [
    DynamicChip,
    currentAccountDescr,
    currentAccountName,
    handleAccountDescrInputChange,
    handleAccountNameInputChange,
    handleClose,
    handleSubmit,
    isAccountInfoDisplayed,
  ]);

  if (balance === undefined) {
    return <></>;
  }

  return (
    <>
      {ConditionalSetAccountInfo}
      {ConditionalAccountInfoDisplay}
      {DynamicChip}
      {/* TODO: Add tooltip explaining what an accountName is for */}
      <AccountNameChip size="small" label={accountName} onClick={() => displayAccountInfo()} />
      <AccountBalanceChip size="small" label={NQTtoNXT(parseInt(balance)).toFixed(unitPrecision) + " JUP"} onClick={() => handleCopy(balance)} />
    </>
  );
};

const SeedphraseEntryBox = styled(Input)(({ theme }) => ({
  minWidth: "400px",
  margin: "40px 0px",
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
  margin: "20px 0px",
}));

const AccountNameDetailed = styled(Input)(({ theme }) => ({
  minWidth: "200px",
  margin: "20px 10px",
}));

const AccountDescriptionDetailed = styled(Input)(({ theme }) => ({
  minWidth: "80%",
  margin: "20px 0px",
}));

const AccountAvatarChip = styled(Chip)(({ theme }) => ({
  width: "95%",
  margin: theme.spacing(2) + " " + theme.spacing(1),
}));

const AccountNameChip = styled(Chip)(({ theme }) => ({
  width: "95%",
  margin: "0px " + theme.spacing(1),
  minWidth: "120px",
  borderRadius: "6px",
  border: "1px solid white",
}));

const AccountBalanceChip = styled(Chip)(({ theme }) => ({
  width: "95%",
  margin: "8px " + theme.spacing(1),
}));

export default memo(UserInfo);
