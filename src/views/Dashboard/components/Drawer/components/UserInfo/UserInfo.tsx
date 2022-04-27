import React, { memo } from "react";
import { Chip } from "@mui/material";
import useAccount from "hooks/useAccount";

const UserInfo: React.FC = () => {
  const { accountRs, accountName } = useAccount();

  return (
    <>
      <Chip label={accountRs} />
      {/* TODO: Add tooltip explaining what an alias is for */}
      <Chip label={accountName} />
    </>
  );
};

export default memo(UserInfo);
