import React from "react";
import ReactDOM from "react-dom";
import { useAccountContexRenderer, render, screen, fireEvent } from "../../../../../../utils/utils.helper.tsx";
import GenerateSeedStep from ".";

let checkboxClickSpy: Function;
beforeEach(() => {
  checkboxClickSpy = jest.fn();
});

it("should render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<GenerateSeedStep stepForwardFn={checkboxClickSpy} />, div);
});

it("should include various elements", () => {
  render(<GenerateSeedStep stepForwardFn={checkboxClickSpy} />);
  expect(screen.getByRole("button")).toBeInTheDocument();
});

it("should have appropriate button behavior", () => {
  const providerProps = {
    fetchFn: jest.fn(),
  };

  useAccountContexRenderer(<GenerateSeedStep stepForwardFn={checkboxClickSpy} />, providerProps);
  fireEvent.click(screen.getByText("Generate Wallet"));
  expect(providerProps.fetchFn).toHaveBeenCalledTimes(1);
});
