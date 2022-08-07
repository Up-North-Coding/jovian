import { NxtAddress } from "utils/wallet/nxtAddress";

beforeEach(() => {
  jest.mock("utils/wallet/nxtAddress");
});

it("should create a new instance", () => {
  new NxtAddress();
});
