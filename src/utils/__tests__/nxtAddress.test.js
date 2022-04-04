import { NxtAddress } from "utils/wallet/nxtAddress";

// here's how we're using the nxtAddress code in production
//
// if (RSFormat) {
//     var address = new NxtAddress();
//
//     if (address.set(accountId)) {
//       return address.toString();
//     } else {
//       return "";
//     }
//   } else {
//     return accountId;
//   }
// }
//

// est.mock('./library', () => {
//     const mockExchange = { someFunction: jest.fn() };
//     return { exchange_name: jest.fn(() => mockExchange) };
//   });

let mockNXTAddress;
// let setSpy;
beforeEach(() => {
  mockNXTAddress = jest.mock("utils/wallet/nxtAddress");
  //   setSpy = jest.spyOn(mockNXTAddress, "set");
});

it.only("should create a new instance", () => {
  const address = new NxtAddress();
});

it("should set a valid accountID without error", () => {
  const testAccountId = "test";
  const address = new NxtAddress();

  console.log(mockNXTAddress, "spy:", setSpy);

  if (address.set(testAccountId)) {
    expect(address.toString()).not.toEqual("");
  } else {
    expect(address.toString()).toEqual("JUP-3333-3333-3333-33333");
  }
});
