import React from "react";
import ReactDOM from "react-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import BackupSeedStep from ".";

// TODO: Rename file to .tsx and fix the errors
let checkboxClickSpy;
beforeEach(() => {
  checkboxClickSpy = jest.fn();
});

it("should render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<BackupSeedStep stepForwardFn={checkboxClickSpy} />, div);
});

it("should include various elements", () => {
  const div = document.createElement("div");
  render(<BackupSeedStep stepForwardFn={checkboxClickSpy} />, div);
  expect(screen.getByRole("textbox")).toBeInTheDocument();
  expect(screen.getByRole("button")).toBeInTheDocument();
  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(screen.getByRole("checkbox")).toBeInTheDocument();
  expect(screen.getByText(/WARNING/)).toBeInTheDocument();
});

it("should have appropriate checkbox behavior", () => {
  const div = document.createElement("div");
  render(<BackupSeedStep stepForwardFn={checkboxClickSpy} />, div);
  expect(screen.getByRole("checkbox")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("checkbox"));

  expect(screen.getByText("I have backed up my seed phrase")).toBeInTheDocument();
  expect(checkboxClickSpy).toHaveBeenCalledTimes(1);
});
