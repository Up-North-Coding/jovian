import React from "react";
import ReactDOM from "react-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import RememberMeCheckbox from "../RememberMeCheckbox";

let fetchFnSpy: (checked: boolean) => void;
beforeEach(() => {
  fetchFnSpy = jest.fn();
});

it("should render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<RememberMeCheckbox fetchIsRememberedFn={fetchFnSpy} />, div);
});

it("should call fetchIsRememberedFn onClick", () => {
  render(<RememberMeCheckbox fetchIsRememberedFn={fetchFnSpy} />);
  expect(screen.getByRole("checkbox")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("checkbox"));

  expect(fetchFnSpy).toHaveBeenCalledTimes(1);
});
