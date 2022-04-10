import React from "react";
import { render, screen } from "@testing-library/react";
import ExistingUserDecideButtonGroup from "../ExistingUserDecideButtonGroup";

it("should render without crashing", () => {
  render(<ExistingUserDecideButtonGroup />);
});

it("should contain a New User and Existing User button", () => {
  render(<ExistingUserDecideButtonGroup />);
  expect(screen.getByText("New User")).toBeInTheDocument();
  expect(screen.getByText("Existing User")).toBeInTheDocument();
});
