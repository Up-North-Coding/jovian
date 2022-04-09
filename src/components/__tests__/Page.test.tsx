import React from "react";
import { render, screen } from "utils/test-utils";
import Page from "../Page";

it("should render without crashing", () => {
  render(<Page />);
});
