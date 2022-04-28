import React, { memo } from "react";
import { Avatar, Chip } from "@mui/material";
import useAccount from "hooks/useAccount";

const placeholderBalance = 10;

const UserInfo: React.FC = () => {
  const { accountRs, accountName } = useAccount();

  return (
    <>
      <Chip label={accountRs} avatar={<Avatar />} />
      {/* TODO: Add tooltip explaining what an accountName is for */}
      <Chip size="small" label={accountName} />
      <Chip size="small" label={placeholderBalance + " JUP"} />
    </>
  );
};

export default memo(UserInfo);
