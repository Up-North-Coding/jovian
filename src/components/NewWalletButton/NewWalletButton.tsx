import React from "react";
import Button from "@mui/material/Button";
import useAccount from "hooks/useAccount";

const NewWalletButton: React.FC = () => {
  const { accountRs, accountSeed, fetchFn } = useAccount();

  if (fetchFn === undefined) {
    return <></>;
  }

  if (!accountRs || !accountSeed) {
    return (
      <Button onClick={() => fetchFn()} variant="contained">
        New Wallet
      </Button>
    );
  }

  return (
    <>
      <p>Account: {accountRs}</p>
      <p>Seed: {accountSeed}</p>
    </>
  );
};

export default React.memo(NewWalletButton);
