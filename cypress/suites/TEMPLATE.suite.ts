//
// Usage: copy this template into a new file {name}.suite.ts, then add tests to appropriate function.
//  then, ensure the imports are updated in suites/index.ts or if customizing the specific tests, ensure to import the tests directly in the spec.
//

/// <reference types="cypress" />

import { ITestSuite } from "../testSuite";

export default {
  name: __filename,
  tests: {
    all: () => {},
    xs: () => {},
    sm: () => {},
    md: () => {},
    lg: () => {},
  },
} as ITestSuite;
