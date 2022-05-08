import React, { memo, useCallback, useMemo, useState } from "react";
import { Box, Button, Chip, Dialog, DialogContent, Input, Stack, styled, Typography } from "@mui/material";
import useAccount from "hooks/useAccount";
import Jazzicon from "react-jazzicon";
import { NQTtoNXT } from "utils/common/NQTtoNXT";
import { unitPrecision } from "utils/common/constants";
import JUPDialog from "components/JUPDialog";

// MUST: currently using "balance" but need to use "availableBalance" or similar because
// balances in orders are still included and should not be

const UserInfo: React.FC = () => {
  const { accountId, accountRs, accountName, balance } = useAccount();
  const [isAccountInfoDisplayed, setIsAccountInfoDisplayed] = useState<boolean>(false);
  const [accountDescription, setAccountDescription] = useState<string>(
    "This is a placeholder description, this isn't saved to the blockchain or retrieved from it."
  );

  const handleCopy = useCallback(
    (toCopy: string | undefined) => {
      if (accountRs === undefined || toCopy === undefined) {
        return;
      }
      // TODO: consider IE support
      navigator.clipboard.writeText(toCopy);
    },
    [accountRs]
  );

  const handleClose = useCallback(() => {
    setIsAccountInfoDisplayed(false);
  }, []);

  const displayAccountInfo = useCallback(() => {
    setIsAccountInfoDisplayed(true);
  }, []);

  const handleSetAccountName = useCallback(() => {
    // need to call setAccountName or something similar from API provider here
  }, []);

  const DynamicChip = useMemo(() => {
    if (accountId === undefined) {
      return <></>;
    }
    return (
      <AccountAvatarChip label={accountRs} avatar={<Jazzicon diameter={30} seed={parseInt(accountId)} />} onClick={() => handleCopy(accountRs)} />
    );
  }, [accountId, accountRs, handleCopy]);

  if (balance === undefined) {
    return <></>;
  }

  return (
    <>
      {isAccountInfoDisplayed && (
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
                  <AccountNameDetailed value={accountName} />
                  <AccountDescriptionDetailed value={accountDescription} multiline={true} />
                  <Button variant="contained" onClick={() => console.log("not implemented...")}>
                    Update Account Info
                  </Button>
                </Stack>
              </Box>
            </DialogContent>
          </JUPDialog>
        </>
      )}
      {DynamicChip}
      {/* TODO: Add tooltip explaining what an accountName is for */}
      <AccountNameChip size="small" label={accountName} onClick={() => displayAccountInfo()} />
      <AccountBalanceChip size="small" label={NQTtoNXT(parseInt(balance)).toFixed(unitPrecision) + " JUP"} onClick={() => handleCopy(balance)} />
    </>
  );
};

const AccountNameDetailed = styled(Input)(({ theme }) => ({
  minWidth: "200px",
  margin: "20px 00px",
}));

const AccountDescriptionDetailed = styled(Input)(({ theme }) => ({
  minWidth: "80%",
  margin: "20px 00px",
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
