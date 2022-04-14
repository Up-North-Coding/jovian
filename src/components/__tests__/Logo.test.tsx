import React from "react";
import { render, screen } from "utils/utils.helper.tsx";
import Logo from "../Logo";

it("should render without crashing", () => {
  render(<Logo />);
});

it("should contain an image", () => {
  render(<Logo />);
  expect(screen.getByRole("img")).toBeInTheDocument();
});
