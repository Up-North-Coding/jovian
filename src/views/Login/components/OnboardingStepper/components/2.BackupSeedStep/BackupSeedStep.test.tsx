import React from "react";
import ReactDOM from "react-dom";
import { useAccountContexRenderer, render, screen, fireEvent } from "utils/test-utils";
import BackupSeedStep from ".";

let checkboxClickSpy: Function;
beforeEach(() => {
  checkboxClickSpy = jest.fn();
});

it("should render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<BackupSeedStep stepForwardFn={checkboxClickSpy} />, div);
});

it.only("should include various elements", () => {
  const providerProps = {
    accountRs: "JUP-ABCD-EFGH-JKMN-PQRST",
    accountSeed: "test help friend lovely acid ball fire fridge folk drive plaque purple",
  };

  useAccountContexRenderer(<BackupSeedStep stepForwardFn={checkboxClickSpy} />, providerProps);
  // expect(screen.getByRole("textbox")).toBeInTheDocument();
  // expect(screen.getByRole("button")).toBeInTheDocument();
  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(screen.getByRole("checkbox")).toBeInTheDocument();
  expect(screen.getByText(/WARNING/)).toBeInTheDocument();
});

it("should have appropriate checkbox behavior", () => {
  render(<BackupSeedStep stepForwardFn={checkboxClickSpy} />);
  fireEvent.click(screen.getByRole("checkbox"));
  expect(screen.getByText("I have backed up my seed phrase")).toBeInTheDocument();
  expect(checkboxClickSpy).toHaveBeenCalledTimes(1);
});

it("should have appropriate checkbox behavior", () => {
  render(<BackupSeedStep stepForwardFn={checkboxClickSpy} />);
  fireEvent.click(screen.getByRole("checkbox"));
  expect(screen.getByText("I have backed up my seed phrase")).toBeInTheDocument();
  expect(checkboxClickSpy).toHaveBeenCalledTimes(1);
});

it.todo("should regenerate the accountSeed when the refresh button is clicked");
