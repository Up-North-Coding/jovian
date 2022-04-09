import { NxtAddress } from "utils/wallet/nxtAddress";

beforeEach(() => {
  jest.mock("utils/wallet/nxtAddress");
});

it("should create a new instance", () => {
  new NxtAddress();
});

// TODO: improve this test or discard it if it's not needed, it might not be doing much right now
it("should set a valid accountID without error", () => {
  const testAccountId = "test";
  const address = new NxtAddress();

  if (address.set(testAccountId)) {
    expect(address.toString()).not.toEqual("");
  } else {
    expect(address.toString()).toEqual("JUP-3333-3333-3333-33333");
  }
});
