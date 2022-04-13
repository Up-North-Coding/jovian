import React from "react";
import { render } from "utils/test-utils";
import App from "../App";

it("should render without crashing", () => {
  render(<App />);
});
