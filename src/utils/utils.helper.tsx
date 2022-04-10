//
// Provides some useful utils/wrappers for standing up various context stacks for tests
//

import { render } from "@testing-library/react";
import { AccountContext } from "contexts/AccountContext";
import { ContextValues } from "contexts/AccountContext/types";

const useAccountContexRenderer = (
  ui: React.ReactElement,
  providerProps: ContextValues,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  renderOptions?: any
) => {
  return render(<AccountContext.Provider value={providerProps}>{ui}</AccountContext.Provider>, renderOptions);
};

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
// override render export
export { useAccountContexRenderer };
