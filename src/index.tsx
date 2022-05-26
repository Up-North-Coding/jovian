import React from "react";
import { render } from "react-dom";
import App from "./App";
import { CssBaseline } from "@mui/material";

// Snackbar/notification stuff
import { SnackbarProvider } from "notistack";
import { MaximumSnackbarMessages } from "utils/common/constants";

render(
  <React.StrictMode>
    <CssBaseline />
    <SnackbarProvider maxSnack={MaximumSnackbarMessages}>
      <App />
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
