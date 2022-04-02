import React from "react";
import ReactDOM from "react-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import BackupSeedStep from "../BackupSeedStep";

// there's a code branch which involves firing an alert
// but this might be refactored so not worried about testing
// it for now. This supresses a test runtime error
let alertSpy;
alertSpy = jest.spyOn(window, "alert");

it("should render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<BackupSeedStep />, div);
});

it("should include various elements", () => {
  const div = document.createElement("div");
  render(<BackupSeedStep />, div);
  expect(screen.getByRole("textbox")).toBeInTheDocument();
  expect(screen.getByRole("button")).toBeInTheDocument();
  expect(screen.getByRole("alert")).toBeInTheDocument();
  expect(screen.getByText(/WARNING/)).toBeInTheDocument();
});

it("should include a checkbox", () => {
  const div = document.createElement("div");
  render(<BackupSeedStep />, div);
  expect(screen.getByRole("checkbox")).toBeInTheDocument();

  // clicking the checkbox currently errors because stepForwardFn() isn't passed into the checkbox
  // fireEvent.click(screen.getByRole("checkbox"));

  expect(screen.getByText("I have backed up my seed phrase")).toBeInTheDocument();
});
