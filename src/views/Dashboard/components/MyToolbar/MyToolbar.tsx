import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { AppBar, Button } from "@mui/material";
import AddressBook from "../AddressBook";

const drawerWidth = 240;

const MyToolbar: React.FC = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
        <Autocomplete
          sx={{ width: 200 }}
          freeSolo
          options={placeHolderVals.map((option) => option)}
          renderInput={(params) => <TextField {...params} label="Search" />}
        />
        <AddressBook />
        <Button variant="contained">Notifications</Button>
        <Button variant="contained">More Stuff</Button>
      </Stack>
    </AppBar>
  );
};

// placeholder values for the autocomplete
const placeHolderVals = ["test", "hello"];

export default React.memo(MyToolbar);
