import React from "react";
import ReactDOM from "react-dom";
// import { render, screen } from "@testing-library/react";
import AddressInput from "../AddressInput";

it("should render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<AddressInput />, div);
});
