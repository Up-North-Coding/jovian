// Development spec
// this file is intended for dev testing. it can be modified and committed in nearly any way.
//
// if a specific test suite is desired, import the suite and then supply the suite as the argument to the TestSuite() function.
// otherwise, all tests are available by importing "../suites"
// (NOTE: ../suites is expected to be maintained to export all, this is a manual one-time process)
//

import Tests from "../suites";
import TestSuite from "../testSuite";

TestSuite("dev.spec", ["all"], Tests);
