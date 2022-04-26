import React from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { GlobalStyles } from "@mui/material";

// Providers
import { AccountProvider } from "contexts/AccountContext";
import { APIProvider } from "contexts/APIContext";
import { AuthProvider } from "contexts/AuthContext";

// Views
import Login from "views/Login";
import Dashboard from "views/Dashboard";
import useAuth from "hooks/useAuth";

/*
 * https://github.com/jupiter-project/logos
 * #006937 - gradient dark
 * #39885A - shield dark
 * #009044 - gradient light
 * #4B9D6E - shield light
 */

const JUP_LIGHT = "#4B9D6E";
// Const JUP_DARK = "#006937";
const JUP_MAIN = "#009046";
const BODY_DARK = "#0a1c13";

// Login page wraps a private route for everything else. The private route determines if a user is logged in.
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <MUIThemeProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Private Component={Dashboard} />} />
          </Routes>
        </MUIThemeProvider>
      </Router>
    </AuthProvider>
  );
};

/*
 * If using labs, follow this guide for typescript to work:
 * https://mui.com/components/about-the-lab/#typescript
 */
const MUIThemeProvider: React.FC = ({ children }) => {
  const globalStyle = {
    body: {
      backgroundColor: BODY_DARK,
    },
  };
  const muiTheme = createTheme({
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

  // TODO: refactor so this only handles the styling stuff if possible and the APIProvider and AccountProvider can be passed in as children?
  return (
    <ThemeProvider theme={muiTheme}>
      <GlobalStyles styles={globalStyle} />
      <APIProvider>
        <AccountProvider>{children}</AccountProvider>
      </APIProvider>
    </ThemeProvider>
  );
};

interface IPrivateProps {
  Component: React.NamedExoticComponent;
}

// A wrapper for <Route> that redirects to the home/login
// screen if you're not yet authenticated.
const Private: React.FC<IPrivateProps> = ({ Component }) => {
  const { user } = useAuth();
  return user ? <Component /> : <Navigate to="/" />;
};

export default App;
