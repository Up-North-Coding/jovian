import React from "react";
import { useAccountContexRenderer, screen, render } from "utils/utils.helper";
import ReEnterSeedStep from ".";

let checkboxClickSpy: Function;
beforeEach(() => {
  checkboxClickSpy = jest.fn();
});

it("should render without crashing", () => {
  render(<ReEnterSeedStep stepForwardFn={checkboxClickSpy} />);
});

it("should include various elements when accountSeed is defined", () => {
  const providerProps = {
    accountSeed: "test help friend lovely acid ball fire fridge folk drive plaque purple",
  };

  useAccountContexRenderer(<ReEnterSeedStep stepForwardFn={checkboxClickSpy} />, providerProps);

  // check for all 12 chips by label
  for (const word of providerProps.accountSeed.split(" ")) {
    expect(screen.getByText(word)).toBeInTheDocument();
  }
});

// it("should end-to-end test like a boss", () => {
//   const providerProps = {
//     accountRs: "JUP-ABCD-EFGH-JKMN-PQRST",
//     accountSeed: "test help friend lovely acid ball fire fridge folk drive plaque purple",
//   };

//   useAccountContexRenderer(<ReEnterSeedStep stepForwardFn={checkboxClickSpy} />, providerProps);
//   expect(screen.getAllByRole("button")).toHaveLength(12);

//   reEnterSeed(providerProps.accountSeed, true);
// });

// function reEnterSeed(words: string, isCorrectlyReEntered: boolean) {
//   // perform re-entry correctly
//   if (isCorrectlyReEntered) {
//     for (let i = 0; i < words.length - 1; i++) fireEvent.click(screen.getByText(words[i]));
//   }
// }
