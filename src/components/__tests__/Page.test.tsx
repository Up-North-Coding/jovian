import React from "react";
import { render, screen } from "utils/utils.helper";
import Page from "../Page";

it("should render without crashing", () => {
  render(<Page />);
});
