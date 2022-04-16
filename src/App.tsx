import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { GlobalStyles } from "@mui/material";

// Providers
import { AccountProvider } from "contexts/AccountContext";

// Views
import Login from "views/Login";
import Dashboard from "views/Dashboard";

const JUP_LIGHT = "#4B9D6E",
  // Const JUP_DARK = "#006937";
  JUP_MAIN = "#009046",
  BODY_DARK = "#0a1c13",
  App: React.FC = () => (
    <Router>
      <MUIThemeProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </MUIThemeProvider>
    </Router>
  ),
  /*
   * https://github.com/jupiter-project/logos
   * #006937 - gradient dark
   * #39885A - shield dark
   * #009044 - gradient light
   * #4B9D6E - shield light
   */

  /*
   * If using labs, follow this guide for typescript to work:
   * https://mui.com/components/about-the-lab/#typescript
   */
  MUIThemeProvider: React.FC = ({ children }) => {
    const globalStyle = {
        body: {
          backgroundColor: BODY_DARK,
        },
      },
      muiTheme = createTheme({
        spacing: 8, // 8 is default but specifying for explicitness
        components: {
          MuiButton: {
            /*
             * #4c9d6f - jup green
             * #3a895a - jup darker green
             * #006d39 - even darker jup green
             */
            styleOverrides: {
              contained: {
                background: "#006d39",
                border: "1px solid #fff",
              },
              root: {
                ":hover": {
                  background: "#00803f",
                },
              },
            },
          },
        },
        palette: {
          mode: "dark",
          primary: {
            light: JUP_LIGHT,
            main: JUP_MAIN,
            dark: BODY_DARK, // JUP_DARK,
          },
          success: {
            main: "#3acf14", // Light green
          },
          info: {
            main: "#247ba0", // Blue/teal
          },
          warning: {
            main: "#bf610a", // Dark orange
          },
          error: {
            main: "#bf1212", // Dark red
          },
        },
        typography: {
          subtitle1: {
            fontSize: 12,
          },
          body1: {
            fontWeight: 500,
            color: "#ffffff",
          },
          button: {
            fontStyle: "italic",
          },
          h3: {
            color: "#ffffff",
          },
          h4: {
            color: "#ffffff",
          },
          h5: {
            color: "#ffffff",
          },
          overline: {
            color: "#ffffff",
          },
        },
        shape: {
          borderRadius: 12,
        },
      });

    return (
      <ThemeProvider theme={muiTheme}>
        <GlobalStyles styles={globalStyle} />
        <AccountProvider>{children}</AccountProvider>
      </ThemeProvider>
    );
  };

export default App;
