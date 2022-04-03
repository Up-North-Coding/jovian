import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/material";

// refactor this to allow passing in the optionsArray
const AddressInput: React.FC = () => {
  return <StyledAutocomplete disablePortal options={top100Films} renderInput={(params: any) => <TextField {...params} label="Enter Account" />} />;
};

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  padding: theme.spacing(2),
  minWidth: "200px",
  maxWidth: "600px",
  width: "100%",
}));

// TODO
const top100Films = [
  { label: "The Shawshank Redemption", year: 1994 },
  { label: "The Godfather", year: 1972 },
  { label: "The Godfather: Part II", year: 1974 },
];

export default React.memo(AddressInput);
