//
// a copy of the simpleHash function from the NXT codebase
//

import converters from "./converters";
import CryptoJS from "crypto-js";

export function simpleHash(b1, b2) {
  var sha256 = CryptoJS.algo.SHA256.create();
  sha256.update(converters.byteArrayToWordArray(b1));
  if (b2) {
    sha256.update(converters.byteArrayToWordArray(b2));
  }
  var hash = sha256.finalize();
  return converters.wordArrayToByteArrayImpl(hash, false);
}
