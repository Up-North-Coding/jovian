import React, { memo, useCallback } from "react";
import { Avatar, Chip, styled } from "@mui/material";
import useAccount from "hooks/useAccount";

const placeholderBalance = 10;

const UserInfo: React.FC = () => {
  const { accountRs, accountName } = useAccount();

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

  return (
    <>
      <AccountAvatarChip label={accountRs} avatar={<Avatar />} onClick={() => handleCopy(accountRs)} />
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
      <AccountBalanceChip size="small" label={placeholderBalance + " JUP"} onClick={() => handleCopy(placeholderBalance.toString())} />
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
