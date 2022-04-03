import React, { useCallback, useState } from "react";
import { Alert, TextField, IconButton, Box } from "@mui/material";
import { IStepProps } from "../types";
import { styled } from "@mui/material/styles";
import useAccount from "hooks/useAccount";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const SeedPresentation: React.FC = () => {
  const { accountSeed, fetchFn } = useAccount();

  // fetches a fresh wallet
  const handleRegenerateSeed = useCallback(async () => {
    if (fetchFn === undefined) {
      return;
    }

    // await because we need accountRs and accountSeed to be populated before moving forward
    await fetchFn();
  }, [fetchFn]);

  return (
    <Box>
      <StyledTextField
        variant="standard"
        value={accountSeed}
        InputProps={{
          readOnly: true,
        }}
      />
      <IconButton onClick={handleRegenerateSeed}>
        <AutorenewIcon />
        {/* TODO: Add a copy to clipboard button */}
      </IconButton>
    </Box>
  );
};

const SeedBackupWarningText: React.FC = () => {
  return (
    <Alert severity="error">
      WARNING: This seed phrase is how you access <i>your</i> private account. <u>Anyone</u> with this seed phrase can spend your funds.
      <strong>
        {" "}
        If you lose this seed phrase you will no longer be able to access your funds! Backup your account before continuing to the next page.
      </strong>
    </Alert>
  );
};

const BackupSeedStep: React.FC<IStepProps> = ({ stepForwardFn }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsChecked(event.target.checked);

      if (event.target.checked) {
        stepForwardFn();
      }
    },
    [stepForwardFn]
  );

  return (
    <>
      <SeedPresentation />
      <SeedBackupWarningText />
      <FormGroup>
        {/* TODO: Make the checkbox' presence more obvious by adding a background/making it look more like a button */}
        <FormControlLabel control={<Checkbox checked={isChecked} onChange={handleChange} />} label="I have backed up my seed phrase" />
      </FormGroup>
    </>
  );
};

const StyledTextField = styled(TextField)(({ theme }) => ({
  minWidth: "360px",
  width: "40vw",
  maxWidth: "650px",
}));

export default React.memo(BackupSeedStep);
