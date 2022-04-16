import React, { memo } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { AppBar, Button } from "@mui/material";

const drawerWidth = 240,
  MyToolbar: React.FC = () => (
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
        <Button variant="contained">AddressBook</Button>
        <Button variant="contained">Notifications</Button>
        <Button variant="contained">More Stuff</Button>
      </Stack>
    </AppBar>
  ),
  // Placeholder values for the autocomplete
  placeHolderVals = ["test", "hello"];

export default memo(MyToolbar);
