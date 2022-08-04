//
// used at the api.ts layer for generic error detection
//

export const errorCheck = (result: any) => {
  if (result?.errorCode === 4) {
    throw new Error("Critical SQL Error: ", result);
  }
};
