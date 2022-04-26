import useAccount from "hooks/useAccount";
import React from "react";
import Context from "./Context";

const AuthProvider: React.FC = ({ children }) => {
  // const { accountRs } = useAccount();
  const test = "JUP-TEST-TEST-TEST-TESTT"; // hardcoded test for now

  // const test = undefined;
  return (
    <Context.Provider
      value={{
        user: test,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default AuthProvider;
