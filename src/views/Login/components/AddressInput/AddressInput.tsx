import React, { useCallback, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { InputProps } from "@mui/material";

const autocompleteSx = {
  padding: "16px",
  minWidth: "200px",
  maxWidth: "600px",
  width: "100%",
};

export interface IInputOptions extends InputProps {
  localStorageAccounts: Array<string>;
}

const AddressInput: React.FC<IInputOptions> = ({ localStorageAccounts }) => {
  const [value, setValue] = useState("");

  const handleInputChange = useCallback((newValue: string | null) => {
    if (newValue === null) {
      return;
    }

    // TODO: Add formatting to address entry
    // - Auto uppercase
    // - 'JUP-' prefixing and hyphens at appropriate positions
    //
    // if (newValue.length > 2) {
    //   newValue += "-";
    // }
    setValue(newValue);
  }, []);

  useEffect(() => {
    console.log("useEffect input value:", value, "useEffect localStorageAccounts:", localStorageAccounts);
  }, [value, localStorageAccounts]);

  return (
    <Autocomplete
      sx={autocompleteSx}
      value={value}
      freeSolo
      disablePortal
      onChange={(e, value) => handleInputChange(value)}
      options={localStorageAccounts}
      renderInput={(params: any) => <TextField onChange={(e) => handleInputChange(e.target.value)} {...params} label="Enter Account" />}
    />
  );
};

export default React.memo(AddressInput);
