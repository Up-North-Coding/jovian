import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Button, Chip, Input, InputLabel, styled, Typography } from "@mui/material";
import Jazzicon from "react-jazzicon";
import { useSnackbar } from "notistack";
import { BigNumber } from "bignumber.js";
import JUPDialog from "components/JUPDialog";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import { LongUnitPrecision } from "utils/common/constants";
import { messageText } from "utils/common/messages";
import useAccount from "hooks/useAccount";
import useAPIRouter from "hooks/useAPIRouter";

const UserInfo: React.FC = () => {
  const [isAccountInfoDisplayed, setIsAccountInfoDisplayed] = useState<boolean>(false);
  const [currentAccountName, setCurrentAccountName] = useState<string>();
  const [currentAccountDescr, setCurrentAccountDescr] = useState<string>();
  const { accountId, accountRs, accountName, accountDescription, balance } = useAccount();
  const { setAccountInfo } = useAPIRouter();
  const { enqueueSnackbar } = useSnackbar();

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

  const handleSetAccountName = useCallback(async () => {
    if (setAccountInfo) {
      const result = await setAccountInfo(currentAccountName || "", currentAccountDescr || "");
    }
  }, [currentAccountDescr, currentAccountName, setAccountInfo]);

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

  const ConditionalAccountInfoDisplay = useMemo(() => {
    return (
      isAccountInfoDisplayed && (
        <>
          <JUPDialog title="Account Information" isOpen={isAccountInfoDisplayed} closeFn={handleClose} isCard>
            <Typography align="center">Make changes to information below and then click update to save the changes to the blockchain.</Typography>
            {DynamicChip}
            <InputLabel>
              Account Name:
              <AccountNameDetailed value={currentAccountName} onChange={(e) => handleAccountNameInputChange(e.target.value)} />
            </InputLabel>
            <InputLabel>
              Description:
              <AccountDescriptionDetailed
                value={currentAccountDescr}
                onChange={(e) => handleAccountDescrInputChange(e.target.value)}
                multiline={true}
              />
            </InputLabel>
            <Button fullWidth variant="green" onClick={handleSetAccountName}>
              Update Account Info
            </Button>
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
    handleSetAccountName,
    isAccountInfoDisplayed,
  ]);

  if (balance === undefined) {
    return <></>;
  }

  return (
    <>
      {ConditionalAccountInfoDisplay}
      {DynamicChip}
      {/* TODO: Add tooltip explaining what an accountName is for */}
      <AccountNameChip size="small" label={accountName} onClick={() => displayAccountInfo()} />
      <AccountBalanceChip
        size="small"
        label={NQTtoNXT(new BigNumber(balance)).toFixed(LongUnitPrecision) + " JUP"}
        onClick={() => handleCopy(balance)}
      />
    </>
  );
};

const AccountNameDetailed = styled(Input)(() => ({
  minWidth: "200px",
  margin: "20px 10px",
}));

const AccountDescriptionDetailed = styled(Input)(() => ({
  minWidth: "80%",
  margin: "20px 10px",
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
