import React, { useCallback, useMemo, useState } from "react";
import { Alert, IconButton, Box, Tooltip } from "@mui/material";
import { IStepProps } from "../types";
import { styled } from "@mui/material/styles";
import useAccount from "hooks/useAccount";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
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

    // await because we need accountSeed to be populated before moving forward
    await fetchFn();
  }, [fetchFn]);

  const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement, Element>) => event?.target?.select();

  const handleCopy = useCallback(() => {
    if (accountSeed === undefined) {
      return;
    }
    // TODO: consider IE support
    navigator.clipboard.writeText(accountSeed);
  }, [accountSeed]);

  // splits word list into columns and rows to condense display
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
      {/* BUG: with long seed words, the words can get pushed to 4 lines instead of 3 */}
      <Styledtextarea onFocus={handleFocus} readOnly value={SeedPhrases}></Styledtextarea>
      <Tooltip title="Regenerate Seed">
        <IconButton onClick={handleRegenerateSeed}>
          <AutorenewIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Copy Seed">
        <IconButton onClick={handleCopy}>
          <FileCopyOutlinedIcon />
        </IconButton>
      </Tooltip>
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

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  background: theme.palette.primary.main,
  padding: "25px",
  borderRadius: "15px",
}));

const Styledtextarea = styled("textarea")(({ theme }) => ({
  width: "430px",
  height: "110px",
  padding: "15px",
  textAlign: "center",
  background: "#222",
  color: "#fff",
  fontSize: "20px",
  lineHeight: "24px",

  [theme.breakpoints.down("md")]: {
    width: "340px",
    color: "red",
    display: "block",
    margin: "0 40px",
  },
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    margin: "0 60px",
    padding: "10px",
  },
}));

export default React.memo(BackupSeedStep);
