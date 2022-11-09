import React, { memo } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup, { ToggleButtonGroupProps } from "@mui/material/ToggleButtonGroup";
import { styled } from "@mui/material";

type IExistingUserTypeButtonGroupProps = ToggleButtonGroupProps;

const ExistingUserTypeButtonGroup: React.FC<IExistingUserTypeButtonGroupProps> = ({ value, onChange }) => (
  <StyledToggleButtonGroup value={value} exclusive onChange={onChange} aria-label="existing user choice">
    <ToggleButton value="secretPhrase" aria-label="secretPhrase">
      Phrase
    </ToggleButton>
    <ToggleButton value="address" aria-label="address">
      Address
    </ToggleButton>
  </StyledToggleButtonGroup>
);
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export default memo(ExistingUserTypeButtonGroup);
