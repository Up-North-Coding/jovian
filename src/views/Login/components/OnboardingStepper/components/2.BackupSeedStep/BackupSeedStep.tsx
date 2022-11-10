import React, { memo, useCallback, useMemo, useState } from "react";
import { Alert, Box, Button, ButtonGroup, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { IStepProps } from "../types";
import useAccount from "hooks/useAccount";

const SeedPresentation: React.FC = () => {
  const { accountSeed, fetchNewAccount } = useAccount();
  // Fetches a fresh wallet
  const handleRegenerateSeed = useCallback(async () => {
    if (fetchNewAccount === undefined) {
      return;
    }

    // Await because we need accountSeed to be populated before moving forward
    await fetchNewAccount();
  }, [fetchNewAccount]);
  const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement, Element>) => event?.target?.select();
  const handleCopy = useCallback(() => {
    if (accountSeed === undefined) {
      return;
    }
    navigator.clipboard.writeText(accountSeed);
  }, [accountSeed]);
  // Splits word list into columns and rows to condense display
  const SeedPhrases = useMemo(() => {
    if (accountSeed === undefined) {
      return "";
    }
    const words = accountSeed?.split(" ");
    const wordPerRow = 4;
    const ret = [] as Array<string>;
    for (let i = 0; i < words?.length; i += wordPerRow) {
      ret.push(words.slice(i, i + wordPerRow).join(" "));
    }

    return ret.join("\n");
  }, [accountSeed]);

  return (
    <Box>
      <Styledtextarea onFocus={handleFocus} readOnly value={SeedPhrases}></Styledtextarea>
      <StyledBox>
        <StyledButtonGroup>
          <Tooltip title="Regenerate Seed">
            <StyledButton variant="outlined" onClick={handleRegenerateSeed}>
              <AutorenewIcon />
            </StyledButton>
          </Tooltip>
          <Tooltip title="Copy Seed">
            <StyledButton variant="outlined" onClick={handleCopy}>
              <FileCopyOutlinedIcon />
            </StyledButton>
          </Tooltip>
        </StyledButtonGroup>
      </StyledBox>
    </Box>
  );
};

const SeedBackupWarningText: React.FC = () => {
  return (
    <>
      <StyledAlert severity="error">
        WARNING: This seed phrase is how you access <i>your</i> private account. <u>Anyone</u> with this seed phrase can spend your funds.
        <strong>
          {" "}
          If you lose this seed phrase you will no longer be able to access your funds! Backup your account before continuing to the next page.
        </strong>
      </StyledAlert>
    </>
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
        <StyledFormControlLabel control={<Checkbox checked={isChecked} onChange={handleChange} />} label="I have backed up my seed phrase" />
      </FormGroup>
    </>
  );
};

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    width: "100px",
    height: "80px",
  },
}));

const StyledBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  background: theme.palette.primary.main,
  padding: "25px",
  borderRadius: "15px",
}));

const Styledtextarea = styled("textarea")(({ theme }) => ({
  width: "480px",
  height: "110px",
  padding: "15px 0px",
  textAlign: "center",
  background: "#222",
  color: "#fff",
  fontSize: "20px",
  lineHeight: "24px",

  [theme.breakpoints.down("md")]: {
    width: "400px",
    display: "block",
    fontSize: "18px",
  },
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    margin: "0 60px",
    padding: "10px",
  },
}));

export default memo(BackupSeedStep);
