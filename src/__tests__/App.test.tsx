import React from "react";
import { render } from "utils/utils.helper";
import App from "../App";

it("should render without crashing", () => {
  render(<App />);
});
