import React from "react";
import { render } from "utils/utils.helper.tsx";
import App from "../App";

it("should render without crashing", () => {
  render(<App />);
});
