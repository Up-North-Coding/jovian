import React from "react";
import { useAccountContexRenderer, render, screen, fireEvent } from "utils/utils.helper";
import BackupSeedStep from ".";

let checkboxClickSpy: () => void;
beforeEach(() => {
  checkboxClickSpy = jest.fn();
});

it("should render without crashing", () => {
  render(<BackupSeedStep stepForwardFn={checkboxClickSpy} />);
});

it("should include various elements", () => {
  const providerProps = {
    accountRs: "JUP-ABCD-EFGH-JKMN-PQRST",
    accountSeed: "test help friend lovely acid ball fire fridge folk drive plaque purple",
  };

  useAccountContexRenderer(<BackupSeedStep stepForwardFn={checkboxClickSpy} />, providerProps);
  expect(screen.getByText("test help friend lovely acid ball fire fridge folk drive plaque purple")).toBeInTheDocument();
  expect(screen.getByText(/warning/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /regenerate seed/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /copy seed/i })).toBeInTheDocument();
  expect(screen.getByText(/i have backed up my seed phrase/i)).toBeInTheDocument();
});

it("should have appropriate checkbox behavior", () => {
  render(<BackupSeedStep stepForwardFn={checkboxClickSpy} />);
  fireEvent.click(screen.getByRole("checkbox"));
  expect(screen.getByText("I have backed up my seed phrase")).toBeInTheDocument();
  expect(checkboxClickSpy).toHaveBeenCalledTimes(1);
});

it("should regenerate the accountSeed when the refresh button is clicked", () => {
  const providerProps = {
    accountRs: "JUP-ABCD-EFGH-JKMN-PQRST",
    accountSeed: "test help friend lovely acid ball fire fridge folk drive plaque purple",
    fetchNewAccount: jest.fn(),
  };
  useAccountContexRenderer(<BackupSeedStep stepForwardFn={checkboxClickSpy} />, providerProps);
  expect(screen.getByText("test help friend lovely acid ball fire fridge folk drive plaque purple")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /regenerate seed/i }));

  // TODO: It would be nice if we could check for a new seed but it's not as simple as mocking a return value fron fetchFn because
  // the real fetchFn changes a state value
  // expect(screen.getByText("grandma jingle freight pole pipes color fling grip fang chip junk fire")).toBeInTheDocument();

  // we expect the clicking of the regenerate button to trigger a call to the provider's fetchNewAccount
  expect(providerProps.fetchNewAccount).toHaveBeenCalledTimes(1);
});

it("should have appropriate checkbox behavior", () => {
  render(<BackupSeedStep stepForwardFn={checkboxClickSpy} />);
  fireEvent.click(screen.getByRole("checkbox"));
  expect(screen.getByText("I have backed up my seed phrase")).toBeInTheDocument();
  expect(checkboxClickSpy).toHaveBeenCalledTimes(1);
});

it.todo("should copy the seed to the clipboard when the copy button is clicked");
