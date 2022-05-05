import React, { memo, useCallback, useMemo } from "react";
import { Chip, styled } from "@mui/material";
import useAccount from "hooks/useAccount";
import Jazzicon from "react-jazzicon";
import { NQTtoNXT } from "utils/common/NQTtoNXT";

// MUST: currently using "balance" but need to use "availableBalance" or similar because
// balances in orders are still included and should not be

const UserInfo: React.FC = () => {
  const { accountId, accountRs, accountName, balance } = useAccount();

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
      {DynamicChip}
      {/* TODO: Add tooltip explaining what an accountName is for */}
      <AccountNameChip size="small" label={accountName} onClick={() => handleCopy(accountName)} />
      <AccountBalanceChip size="small" label={NQTtoNXT(parseInt(balance)) + " JUP"} onClick={() => handleCopy(balance)} />
    </>
  );
};

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
