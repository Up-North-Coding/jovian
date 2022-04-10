import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup, { ToggleButtonGroupProps } from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material";

type IExistingUserDecideButtonGroupProps = ToggleButtonGroupProps;

const ExistingUserDecideButtonGroup: React.FC<IExistingUserDecideButtonGroupProps> = ({ value, onChange }) => {
  return (
    <StyledToggleButtonGroup value={value} exclusive onChange={onChange} aria-label="existing user choice">
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
