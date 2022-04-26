import React, { ReactElement, memo, useCallback, useEffect, useMemo, useState } from "react";
import useAccount from "hooks/useAccount";
import { Alert, Button, Chip, Grid, Typography, styled } from "@mui/material";
import { IStepProps } from "../types";
import useBreakpoint from "hooks/useBreakpoint";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

interface IReEntryChipProps {
  onClickFn: (label: string) => boolean;
  onDeleteFn: (label: string) => boolean;
  labelText: string;
}

const ReEntryChip: React.FC<IReEntryChipProps> = ({ onClickFn, onDeleteFn, labelText }) => {
  const [isClicked, setIsClicked] = useState(false);
  const handleDelete = useCallback(() => {
    const result = onDeleteFn(labelText);

    if (result) {
      setIsClicked((prev) => !prev);
    }
  }, [onDeleteFn, labelText]);
  const handleClick = useCallback(() => {
    const result = onClickFn(labelText);
    if (result) {
      setIsClicked((prev) => !prev);
      return;
    }
    handleDelete();
  }, [onClickFn, labelText, handleDelete]);

  return isClicked ? (
    <StyledChip sx={{ border: "dashed 1px" }} onClick={handleClick} label={labelText} icon={<RemoveCircleOutlineIcon />} />
  ) : (
    <StyledChip onClick={handleClick} label={labelText} />
  );
};

const ReEnterSeedStep: React.FC<IStepProps> = ({ stepForwardFn }) => {
  const { accountSeed } = useAccount();
  const [reEntryText, setReEntryText] = useState<Array<string>>();
  const [isReEnteredCorrectly, setIsReEnteredCorrectly] = useState(false);
  const [wordList, setWordList] = useState<Array<string>>();
  const isSmallBrowser = useBreakpoint("<", "sm");
  const [reEntryCounter, setReEntryCounter] = useState<number | undefined>(0);
  /*
   * DEV USE
   * Skips past the re-entry step for convenience
   * UseEffect(() => {
   *   StepForwardFn(); // steps past this step altogether without having to re-enter words
   * }, [stepForwardFn]);
   */

  // Removes from reEntryText when a user clicks the "X" on chips
  const reEntryDeleteFn = useCallback((label: string) => {
    let didChange = false;
    setReEntryText((prev) => {
      let newArray: Array<string> = [];

      if (prev === undefined) {
        return [];
      }

      const len = prev?.length || 0;

      /*
       * TODO: mark the last word picked somewhere on the chip (asterisk?) so the user can more easily find the last word to remove
       * They've clicked the last label in the array, this is the only condition we want to allow
       * The user to remove the word
       */
      if (prev[len - 1] === label) {
        newArray = [...prev.slice(0, len - 1)];
        didChange = true;
        return newArray;
      }

      // Otherwise we give them the same array back
      return prev;
    });
    return didChange;
  }, []);
  // Adds to reEntryText when a user clicks chips
  const reEntryChipClickFn = useCallback((label: string) => {
    let didChange = false;
    setReEntryText((prev) => {
      let newArray: Array<string> = [];
      if (prev === undefined) {
        prev = [];
      }

      // The user has already re-entered this word
      // BUG: seed words can contain duplicate words
      if (prev.includes(label)) {
        return prev;
      }
      newArray = [...prev, label];
      didChange = true;
      return newArray;
    });

    // The reEntryText value changed
    return didChange;
  }, []);
  const AlertReEntryStatus = useMemo(() => {
    if (reEntryCounter === undefined) {
      return <></>;
    }

    // User has reentered all words but they're not matching the original
    if (isReEnteredCorrectly === false && reEntryCounter === 12) {
      return (
        // TODO: conditionally render the warning (don't display as the user is re-entering until they have entered all 12 words)
        <Alert severity="error">
          Incorrect seed re-entry, please double check your seed.
          <p>You entered: {reEntryText?.join(" ")}</p>
        </Alert>
      );
    }

    // They aren't done entering all of the words yet
    if (reEntryCounter < 12) {
      return (
        <>
          <Alert severity="info">
            Re-Entered Words ({reEntryCounter} of 12): {reEntryText?.join(" ")}
          </Alert>
        </>
      );
    }

    return (
      <>
        <Alert severity="success">Seed correctly re-entered, you may now proceed.</Alert>
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
  }, [isReEnteredCorrectly, stepForwardFn, reEntryCounter, reEntryText]);
  /*
   * Create chips for each word in the accountSeed and shuffle them before displaying
   * Change so seedToWordArray() is called by a useEffect with accountSeed as its dep
   * Put shuffled word list into state
   */
  const WordChips: Array<ReactElement> | React.ReactFragment = useMemo(() => {
    if (wordList === undefined) {
      return <></>;
    }

    return wordList?.map((item, index) => (
      <Grid item xs={4} sm={3} key={item + index}>
        <ReEntryChip labelText={item} onClickFn={reEntryChipClickFn} onDeleteFn={reEntryDeleteFn} />
      </Grid>
    ));
  }, [reEntryChipClickFn, wordList, reEntryDeleteFn]);

  // Whenever reEntryText changes, reruns to see if matching condition is met yet and updates current counter
  useEffect(() => {
    const reEntryLength = reEntryText?.length;

    setReEntryCounter(reEntryLength);
    if (reEntryText?.join(" ") === accountSeed) {
      setIsReEnteredCorrectly(true);
      return;
    }
    setIsReEnteredCorrectly(false);
  }, [reEntryText, accountSeed, reEntryCounter]);

  useEffect(() => {
    if (accountSeed === undefined) {
      return;
    }
    const wl = seedToWordArray(accountSeed);
    shuffleWordlist(wl); // Shuffles the wordlist in-line
    // Set shuffled word list state here from wordlist (post-shuffle)
    setWordList(wl);
  }, [accountSeed]);

  if (!accountSeed) {
    return (
      <>
        <StyledTypography>No seed present, something went wrong. Please go back and try again.</StyledTypography>
      </>
    );
  }

  return (
    <>
      <StyledTypography>
        Your words are displayed below. Click them in the order you wrote them down to confirm you've backed up your seed correctly. You can click a
        word again to remove it if you make a mistake. Click back to go back and write down your seed words.
      </StyledTypography>
      <StyledGridContainer spacing={0} container justifyContent="center" alignItems="center">
        {WordChips}
      </StyledGridContainer>
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
  [theme.breakpoints.down("md")]: {
    borderRadius: theme.shape.borderRadius,
    width: "100px",
    height: "60px",
  },
}));

const StyledGridContainer = styled(Grid)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  margin: "auto",
  maxWidth: "500px",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    margin: "0 40px",
  },
}));

//
// helper functions
//

function seedToWordArray(seed: string) {
  return seed.split(" ") as Array<string>;
}

function shuffleWordlist(array: Array<string>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export default memo(ReEnterSeedStep);
