import React, { ReactElement, useCallback, useEffect, useState } from "react";
import useAccount from "hooks/useAccount";
import { Alert, Box, Chip, Grid, styled, Typography } from "@mui/material";
import { IStepProps } from "../types";
import { Button } from "semantic-ui-react";

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

const ReEntryDisplay: React.FC = () => {
  return (
    <>
      <Box></Box>
    </>
  );
};

const ReEnterSeedStep: React.FC<IStepProps> = ({ stepForwardFn }) => {
  const { accountSeed } = useAccount();
  // state may become an array of string, it might make it easier to pop off a previous entry when a re-entry is toggled off
  const [reEntryText, setReEntryText] = useState("");
  const [isReEnteredCorrectly, setIsReEnteredCorrectly] = useState(false);

  // DEV USE
  // skips past the re-entry step for convenience
  // useEffect(() => {
  //   // setIsReEnteredCorrectly(true); // sets it like the user has picked their words properly in re-entry step
  //   stepForwardFn(); // steps past this step altogether without having to re-enter words
  // }, [stepForwardFn]);

  const reEntryChipClickFn = (label: string) => {
    setReEntryText((prev) => prev + label + " ");
  };

  useEffect(() => {
    // console.log("new reEntryText:", reEntryText, "seed:", accountSeed);
    if (reEntryText.trim() === accountSeed) {
      setIsReEnteredCorrectly(true);
    }
  }, [reEntryText, accountSeed, stepForwardFn]);

  // create chips for each word in the accountSeed and shuffle them before displaying
  if (accountSeed) {
    const wordList = seedToWordArray(accountSeed);
    shuffleWordlist(wordList); // shuffled the wordlist in-line
    const WordChips: Array<ReactElement> = wordList.map((item, index) => {
      return <ReEntryChip key={item} labelText={item} onClickFn={reEntryChipClickFn} />;
    });
    return (
      <>
        <StyledGridContainer container spacing={0} direction="column">
          <Typography>Your words are displayed below. Click them in the appropriate order to place them into the box below.</Typography>
          <StyledGridItem>{WordChips}</StyledGridItem>
          <StyledReEntryDisplay>{reEntryText}</StyledReEntryDisplay>
          {isReEnteredCorrectly ? (
            <>
              <Alert severity="info">Correctly re-entered, you may now proceed.</Alert>
              <StyledButton
                variant="contained"
                onClick={() => {
                  stepForwardFn();
                }}
              >
                Continue
              </StyledButton>
            </>
          ) : (
            <Alert severity="error">Incorrect seed re-entry, please double check your seed.</Alert>
          )}
        </StyledGridContainer>
      </>
    );
  }

  return (
    <>
      <Typography>No seed present, something went wrong. Please go back and try again.</Typography>
    </>
  );
};

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  width: "40%",
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  width: "100px",
}));

const StyledReEntryDisplay = styled(ReEntryDisplay)(({ theme }) => ({
  backgroundColor: "red",
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
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
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
