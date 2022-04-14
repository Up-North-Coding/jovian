import React from "react";
import { render, screen } from "utils/utils.helper.tsx";
import Page from "../Page";

it("should render without crashing", () => {
  render(<Page />);
});
