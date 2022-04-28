import React, { memo, useCallback } from "react";
import { Avatar, Chip } from "@mui/material";
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
      <Chip label={accountRs} avatar={<Avatar />} onClick={() => handleCopy(accountRs)} />
      {/* TODO: Add tooltip explaining what an accountName is for */}
      <Chip size="small" label={accountName} onClick={() => handleCopy(accountName)} />
      <Chip size="small" label={placeholderBalance + " JUP"} onClick={() => handleCopy(placeholderBalance.toString())} />
    </>
  );
};

export default memo(UserInfo);
