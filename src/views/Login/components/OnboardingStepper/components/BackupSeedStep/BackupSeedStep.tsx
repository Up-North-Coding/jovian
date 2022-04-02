import React, { useState } from "react";
import { Grid, Alert, TextField, IconButton } from "@mui/material";
import { IStepProps } from "../types";
import { styled } from "@mui/material/styles";
import useAccount from "hooks/useAccount";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const SeedPresentation = () => {
  const { accountRs, accountSeed } = useAccount();

  // TODO: improve this condition even though it shouldn't be reachable?
  if (!accountRs || !accountSeed) {
    alert("something went wrong, please try again");
  }

  return (
    <>
      <StyledTextField
        variant="standard"
        defaultValue={accountSeed}
        InputProps={{
          readOnly: true,
        }}
      />
      <IconButton color="primary" aria-label="upload picture" component="span">
        <AutorenewIcon />
      </IconButton>
    </>
  );
};

const SeedBackupWarningText = () => {
  return (
    <Alert severity="error">
      WARNING: This seed phrase is how you access your private account. Anyone with this seed phrase can spend your funds. If you lose this seed
      phrase you will no longer be able to access your account!
    </Alert>
  );
};

const BackupSeedStep: React.FC<IStepProps> = ({ stepForwardFn }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);

    if (event.target.checked) {
      stepForwardFn();
    }
  };

  return (
    <>
      <StyledGridContainer container direction="column">
        <StyledGridItem>
          <StyledSeedPresentation />
        </StyledGridItem>
        <StyledGridItem>
          <SeedBackupWarningText />
        </StyledGridItem>
        <StyledGridItem>
          <FormGroup>
            <FormControlLabel control={<Checkbox checked={isChecked} onChange={handleChange} />} label="I have backed up my seed phrase" />
          </FormGroup>
        </StyledGridItem>
      </StyledGridContainer>
    </>
  );
};

const StyledSeedPresentation = styled(SeedPresentation)(({ theme }) => ({
  minWidth: "600px",
}));

const StyledGridContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  width: "80%",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledGridItem = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  width: "80%",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: "80%",
}));

export default React.memo(BackupSeedStep);
