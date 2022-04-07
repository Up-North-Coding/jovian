import React from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import NewWalletButton from "components/NewWalletButton";

let windowSpy;
beforeEach(() => {
  // fixes an error during button render
  const { getComputedStyle } = window;
  window.getComputedStyle = (elt) => getComputedStyle(elt);

  window.crypto = { getRandomValues: jest.fn() };

  windowSpy = jest.spyOn(window.crypto, "getRandomValues");
});
// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

it("should take a click and generate a seed (eventually a wallet address)", () => {
  const { getByRole } = render(<NewWalletButton />);
  const button = getByRole("button", {
    name: /new wallet/i,
  });

  expect(button).toMatchSnapshot();

  fireEvent.click(button);
  expect(windowSpy).toHaveBeenCalledTimes(2);
});
