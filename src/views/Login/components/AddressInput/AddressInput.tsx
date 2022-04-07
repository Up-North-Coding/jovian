import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material";

const AddressInput: React.FC = () => {
  return (
    <StyledAutocomplete
      disablePortal
      id="addressInput"
      options={top100Films}
      renderInput={(params: any) => <TextField {...params} label="Enter Account (JUP-XXXX-XXXX-XXXX-XXXXX)" />}
    />
  );
};

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  padding: theme.spacing(2),
  width: "600px",
}));

// TODO
const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
];

export default React.memo(AddressInput);
