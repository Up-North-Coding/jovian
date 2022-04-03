import React, { useCallback, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material";

interface IExistingUserDecideButtonGroup {
  toggleFn: Function;
}

const ExistingUserDecideButtonGroup: React.FC<IExistingUserDecideButtonGroup> = ({ toggleFn }) => {
  const [userChoice, setUserChoice] = useState<"existing" | "new">("existing");

  const handleChoice = useCallback(
    (event: any, newChoice: any) => {
      setUserChoice(newChoice);
      toggleFn(newChoice);
    },
    [toggleFn]
  );

  return (
    <StyledToggleButtonGroup value={userChoice} exclusive onChange={handleChoice} aria-label="existing user choice">
      <ToggleButton value="new" aria-label="new user">
        New User
      </ToggleButton>
      <ToggleButton value="existing" aria-label="existing user">
        Existing User
      </ToggleButton>
    </StyledToggleButtonGroup>
  );
};

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export default React.memo(ExistingUserDecideButtonGroup);
