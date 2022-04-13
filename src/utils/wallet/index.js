import { generatePassPhrase } from "../../utils/wallet/generatePassphrase";
import { NxtAddress } from "./nxtAddress.js";
import curve25519 from "./curve25519";
import converters from "./converters";
import { simpleHash } from "./simpleHash";

// supresses eslint error
/* globals BigInt */

export async function generateNewWallet() {
  let accountSeed;
  let accountRs;
  try {
    accountSeed = generatePassPhrase();
    accountRs = getAccountRsFromSecretPhrase(accountSeed);
  } catch (e) {
    console.error("error during account generation:", e);
  }

  return { accountRs, accountSeed };
}

function getAccountRsFromSecretPhrase(secretPhrase) {
  const hexS = converters.stringToHexString(secretPhrase);
  const secretPhraseBytes = converters.hexStringToByteArray(hexS);
  const digest = simpleHash(secretPhraseBytes);
  const pubKey = converters.byteArrayToHexString(curve25519.keygen(digest).p);
  const accountRs = getAccountIdFromPublicKey(pubKey, true);

  return accountRs;
}

function byteArrayToBigInteger(byteArray) {
  var value = BigInt("0", 10);
  var temp1, temp2;
  for (var i = byteArray.length - 1; i >= 0; i--) {
    temp1 = value * BigInt("256", 10);
    temp2 = temp1 + BigInt(byteArray[i].toString(10), 10);
    value = temp2;
  }
  return value;
}

function getAccountIdFromPublicKey(publicKey, RSFormat) {
  var hex = converters.hexStringToByteArray(publicKey);
  var account = simpleHash(hex);

  account = converters.byteArrayToHexString(account);

  var slice = converters.hexStringToByteArray(account).slice(0, 8);

  var accountId = byteArrayToBigInteger(slice).toString();

  if (RSFormat) {
    var address = new NxtAddress();

    if (address.set(accountId)) {
      return address.toString();
    } else {
      return "";
    }
  } else {
    return accountId;
  }
}
