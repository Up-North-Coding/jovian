import React, { memo, useCallback, useMemo } from "react";
import { Avatar, Chip, styled } from "@mui/material";
import useAccount from "hooks/useAccount";
import Jazzicon from "react-jazzicon";

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
      <AccountAvatarChip label={accountRs} avatar={<Jazzicon diameter={20} seed={parseInt(accountId)} />} onClick={() => handleCopy(accountRs)} />
    );
  }, [accountId, accountRs, handleCopy]);

  return (
    <>
      {DynamicChip}
      {/* TODO: Add tooltip explaining what an accountName is for */}
      <AccountNameChip
        sx={{
          minWidth: "120px",
          borderRadius: "6px",
          border: "1px solid white",
        }}
        size="small"
        label={accountName}
        onClick={() => handleCopy(accountName)}
      />
      <AccountBalanceChip size="small" label={balance + " JUP"} onClick={() => handleCopy(balance)} />
    </>
  );
};

const AccountAvatarChip = styled(Chip)(({ theme }) => ({
  width: "95%",
  margin: theme.spacing(2) + " 10px",
}));

const AccountNameChip = styled(Chip)(({ theme }) => ({
  width: "90%",
  margin: "0px " + theme.spacing(2),
}));

const AccountBalanceChip = styled(Chip)(({ theme }) => ({
  width: "90%",
  margin: "0px " + theme.spacing(2),
}));

export default memo(UserInfo);
