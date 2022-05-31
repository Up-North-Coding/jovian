import React, { memo } from "react";
import { Stack, styled, Typography } from "@mui/material";
import Logo from "components/Logo";

export const WalletDetails: React.FC = () => (
  <>
    <Stack direction="row">
      <Logo width="100px" padding="10px" />
      <JupiterVersion>Jupiter Wallet version: {APP_VERSION}</JupiterVersion>
    </Stack>
  </>
);

export const JupiterVersion = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export default memo(WalletDetails);
