import React, { useCallback, useState } from "react";
import Context from "./Context";

const AuthProvider: React.FC = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>();

  const handleSignIn = useCallback((account: string) => {
    if (account !== undefined) {
      setIsSignedIn(true);
      return;
    }
    setIsSignedIn(false);
  }, []);

  return (
    <Context.Provider
      value={{
        isSignedIn,
        signIn: handleSignIn,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AuthProvider;
