import React, { useCallback, useState } from "react";
import Context from "./Context";

const AuthProvider: React.FC = ({ children }) => {
  const [signedInUserAccount, setSignedInUserAccount] = useState<string>();

  const handleSignIn = useCallback((account: string) => {
    setSignedInUserAccount(account);
  }, []);

  return (
    <Context.Provider
      value={{
        user: signedInUserAccount,
        signIn: handleSignIn,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AuthProvider;
