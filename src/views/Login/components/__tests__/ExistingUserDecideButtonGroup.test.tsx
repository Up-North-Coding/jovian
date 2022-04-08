import ReactDOM from "react-dom";
import { render, screen } from "@testing-library/react";
import ExistingUserDecideButtonGroup from "../ExistingUserDecideButtonGroup";

it("should render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<ExistingUserDecideButtonGroup />, div);
});

it("should contain a New User and Existing User button", () => {
  render(<ExistingUserDecideButtonGroup />);
  expect(screen.getByText("New User")).toBeInTheDocument();
  expect(screen.getByText("Existing User")).toBeInTheDocument();
});
