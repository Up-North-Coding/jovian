import React, { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import useAccount from "hooks/useAccount";
import { Alert, Box, Chip, Grid, styled, Typography, Button } from "@mui/material";
import { IStepProps } from "../types";
import useBreakpoint from "hooks/useBreakpoint";

interface IReEntryChipProps {
  onClickFn: Function;
  labelText: string;
}

const ReEntryChip: React.FC<IReEntryChipProps> = ({ onClickFn, labelText }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = useCallback(() => {
    onClickFn(labelText);
    setIsClicked((prev) => !prev);
  }, [onClickFn, labelText]);

  return <StyledChip disabled={isClicked} onClick={handleClick} label={labelText} />;
};

const ReEnterSeedStep: React.FC<IStepProps> = ({ stepForwardFn }) => {
  const { accountSeed } = useAccount();
  // state may become an array of string, it might make it easier to pop off a previous entry when a re-entry is toggled off
  const [reEntryText, setReEntryText] = useState("");
  const [isReEnteredCorrectly, setIsReEnteredCorrectly] = useState(false);
  const [wordList, setWordList] = useState<Array<string>>();
  const isSmallBrowser = useBreakpoint("<", "sm");

  // DEV USE
  // skips past the re-entry step for convenience
  useEffect(() => {
    setIsReEnteredCorrectly(true); // sets it like the user has picked their words properly in re-entry step
    // stepForwardFn(); // steps past this step altogether without having to re-enter words
  }, [stepForwardFn]);

  // adjusts reEntryText in state as the user clicks chips
  const reEntryChipClickFn = useCallback((label: string) => {
    setReEntryText((prev) => prev + label + " ");
  }, []);

  const AlertReEntryStatus = useMemo(() => {
    if (isReEnteredCorrectly === false) {
      return (
        // TODO: conditionally render the warning (don't display as the user is re-entering until they have entered all 12 words)
        <Alert severity="error">Incorrect seed re-entry, please double check your seed.</Alert>
      );
    }

    return (
      <>
        <Alert severity="info">Seed correctly re-entered, you may now proceed.</Alert>
        <StyledButton
          variant="contained"
          onClick={() => {
            stepForwardFn();
          }}
        >
          Continue
        </StyledButton>
      </>
    );
  }, [isReEnteredCorrectly, stepForwardFn]);

  // create chips for each word in the accountSeed and shuffle them before displaying
  // change so seedToWordArray() is called by a useEffect with accountSeed as its dep
  // put shuffled word list into state
  const WordChips: Array<ReactElement> | React.ReactFragment = useMemo(() => {
    if (wordList === undefined) {
      return <></>;
    }

    return wordList?.map((item, index) => {
      return (
        <Grid item xs={4} sm={3} key={item + index}>
          <ReEntryChip labelText={item} onClickFn={reEntryChipClickFn} />
        </Grid>
      );
    });
  }, [reEntryChipClickFn, wordList]);

  // validates if the re-entered seed matches the generated seed
  useEffect(() => {
    if (reEntryText.trim() === accountSeed) {
      setIsReEnteredCorrectly(true);
    }
  }, [reEntryText, accountSeed]);

  useEffect(() => {
    if (accountSeed === undefined) {
      return;
    }
    const wl = seedToWordArray(accountSeed);
    shuffleWordlist(wl); // shuffles the wordlist in-line
    // set shuffled word list state here from wordlist (post-shuffle)
    setWordList(wl);
  }, [accountSeed]);

  if (!accountSeed) {
    return (
      <>
        <Typography>No seed present, something went wrong. Please go back and try again.</Typography>
      </>
    );
  }

  return (
    <>
      <Typography>Your words are displayed below. Click them in the appropriate order to place them into the box below.</Typography>
      <StyledGridContainer sx={{ width: isSmallBrowser === true ? "100%" : "80%" }} spacing={0} container justifyContent="center" alignItems="center">
        {WordChips}
      </StyledGridContainer>
      <StyledReEntryDisplay>{reEntryText}</StyledReEntryDisplay>
      {AlertReEntryStatus}
    </>
  );
};

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  width: "40%",
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  width: "100px",
  margin: "10px",
}));

const StyledReEntryDisplay = styled(Box)(({ theme }) => ({
  backgroundColor: "red",
}));

const StyledGridContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  margin: "auto",
  maxWidth: "500px",
}));

//
// helper functions
//

function seedToWordArray(seed: string) {
  return seed.split(" ") as Array<string>;
}

function shuffleWordlist(array: Array<string>) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export default React.memo(ReEnterSeedStep);
