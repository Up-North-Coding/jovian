import React from "react";
import ReactDOM from "react-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import ExistingUserDecideButtonGroup from "../ExistingUserDecideButtonGroup";

let toggleFnSpy: Function;
beforeEach(() => {
  toggleFnSpy = jest.fn();
});

it("should render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ExistingUserDecideButtonGroup toggleFn={toggleFnSpy} />, div);
});

it("should contain a New User and Existing User button", () => {
  render(<ExistingUserDecideButtonGroup toggleFn={toggleFnSpy} />);
  expect(screen.getByText("New User")).toBeInTheDocument();
  expect(screen.getByText("Existing User")).toBeInTheDocument();
});

it("should call toggleFn onClick", () => {
  render(<ExistingUserDecideButtonGroup toggleFn={toggleFnSpy} />);
  expect(screen.getByText("Existing User")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Existing User"));

  expect(toggleFnSpy).toHaveBeenCalledTimes(1);
});
