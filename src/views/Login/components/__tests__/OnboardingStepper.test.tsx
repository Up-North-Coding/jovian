import React from "react";
import ReactDOM from "react-dom";
import { render, screen } from "@testing-library/react";
import OnboardingStepper from "../OnboardingStepper";

it("should render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<OnboardingStepper />, div);
});

it("should contain a Generate Seed step", () => {
  render(<OnboardingStepper />);
  expect(screen.getByText("Generate Seed")).toBeInTheDocument();
});

it("should contain a Backup Seed step", () => {
  render(<OnboardingStepper />);
  expect(screen.getByText("Backup Seed")).toBeInTheDocument();
});

it("should contain a Re-Enter Seed step", () => {
  render(<OnboardingStepper />);
  expect(screen.getByText("Re-Enter Seed")).toBeInTheDocument();
});

it("should contain a Display Address step", () => {
  render(<OnboardingStepper />);
  expect(screen.getByText("Display Address")).toBeInTheDocument();
});
