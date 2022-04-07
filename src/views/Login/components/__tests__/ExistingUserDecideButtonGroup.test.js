import React from "react";
import ReactDOM from "react-dom";
import { render, screen } from "@testing-library/react";
import ExistingUserDecideButtonGroup from "../ExistingUserDecideButtonGroup";

it("should render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ExistingUserDecideButtonGroup />, div);
});

it("should contain a New User button", () => {
  render(<ExistingUserDecideButtonGroup />);
  expect(screen.getByText("New User")).toBeInTheDocument();
});

it("should contain an Existing User button", () => {
  render(<ExistingUserDecideButtonGroup />);
  expect(screen.getByText("Existing User")).toBeInTheDocument();
});
