import React from "react";
import ReactDOM from "react-dom";
import { render, screen } from "@testing-library/react";
import DisplayAddressStep from ".";
import { BrowserRouter as Router } from "react-router-dom";

let checkboxClickSpy: () => void;
beforeEach(() => {
  checkboxClickSpy = jest.fn();
});

it("should render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Router>
      <DisplayAddressStep stepForwardFn={checkboxClickSpy} />
    </Router>,
    div
  );
});

it.skip("should include various elements", () => {
  render(
    <Router>
      <DisplayAddressStep stepForwardFn={checkboxClickSpy} />
    </Router>
  );
  expect(screen.getByText("Go To Dashboard")).toBeInTheDocument();
  expect(screen.getByText("You can give your Jupiter address to others so they can send you Jupiter!")).toBeInTheDocument();
  expect(
    screen.getByText(
      "Anyone can see your account based on your Jupiter address, but your seed words must remain private or others will be able to spend your funds."
    )
  ).toBeInTheDocument();
});
