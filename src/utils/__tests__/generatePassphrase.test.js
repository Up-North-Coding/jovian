import { generatePassPhrase, wordList } from "../wallet/generatePassphrase";
import { createHash } from "crypto";

let windowSpy;

const DEFAULTSEED = "like ".repeat(12).trim();

let getRandomFn;

function mockWindowCrypto(randomness) {
  getRandomFn = jest.fn((random) => {
    random.forEach((el, index, array) => {
      array[index] = typeof randomness === "number" ? randomness : randomness[index]; // anything other than 0 should produce a different passphrase
    });
  });

  windowSpy.mockImplementation(() => {
    if (randomness === undefined) {
      return;
    }
    return {
      crypto: {
        getRandomValues: getRandomFn,
      },
    };
  });
}

beforeEach(() => {
  windowSpy = jest.spyOn(window, "window", "get");
  mockWindowCrypto(0);
});

afterEach(() => {
  windowSpy.mockRestore();
});

it("should generate two different passphrases on subsequent executions", () => {
  mockWindowCrypto(0);
  const passphrase1 = generatePassPhrase();

  expect(passphrase1).toEqual(DEFAULTSEED);

  mockWindowCrypto(2);
  const passphrase2 = generatePassPhrase();

  expect(passphrase2).not.toEqual(passphrase1);
});

// Note seedWordIndex has a default value of 0
it("should create a passPhrase with 'like' repeated", () => {
  const passphrase = generatePassPhrase();
  expect(passphrase).toEqual(DEFAULTSEED);
  expect(getRandomFn).toHaveBeenCalledTimes(2);
});

it("should not equal a passPhrase with 'like' repeated", () => {
  mockWindowCrypto(1);
  const passphrase = generatePassPhrase();

  expect(passphrase).not.toEqual(DEFAULTSEED);
  expect(passphrase).toEqual("just ".repeat(12).trim());
  expect(getRandomFn).toHaveBeenCalledTimes(2);
});

it("should generate a predictable passphrase based on specific randomness", () => {
  mockWindowCrypto([2588715843, 1256543494, 1046472652, 4002173725]);
  const passphrase = generatePassPhrase();

  // NEVER USE THIS SEED
  expect(passphrase).toEqual("beauty fail everytime glove corner content realize witch secret grace rose finally");
  expect(getRandomFn).toHaveBeenCalledTimes(2);
});

it("should error when crypto isn't in the window", () => {
  mockWindowCrypto();

  expect(() => {
    generatePassPhrase();
  }).toThrow(/^ERROR_ENCRYPTION_BROWSER_SUPPORT$/);
  expect(getRandomFn).toHaveBeenCalledTimes(0);
});

it("should have the same wordlist as before", () => {
  mockWindowCrypto(0);
  const wordHash = createHash("sha256").update(wordList.join("")).digest("hex");
  expect(wordHash).toEqual("36457fdcaaff463a84891cf5a32710cd754b7efca67060163dd5ae1e5ffe2934");
});

it("should call crypto only twice", () => {
  mockWindowCrypto(1);
  generatePassPhrase();

  expect(getRandomFn).toHaveBeenCalledTimes(2);
});
