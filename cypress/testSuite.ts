/// <reference types="cypress" />

// general overview of how a spec file is used to determine the tests to run:
// 1. spec file sets the screen sizes to use.
// 2. spec file also sets the test suites to run.
// 3. the screen sizes determine which test exported functions to call, eg run tests.all() + specific size
//
// Test Suite Functions:
//  Test suites exports test functions which contain the cypress tests to perform.
//  These functions can either be run for all screen sizes, or for a specific set of screen sizes.
//  The functions are expected to match the breakpoints for each responsive UI change.
//

// the cypress viewport aliases used for screen sizes
const minSupported: IViewportDimensions = { width: 360, height: 640 };
const commonSmallPhone: IViewportDimensions = { width: 375, height: 667 };
const tablet: IViewportDimensions = { width: 768, height: 1024 };
const smDesktop: IViewportDimensions = { width: 1280, height: 800 };
const lgDesktop: IViewportDimensions = { width: 1536, height: 960 };

interface IViewportDimensions {
  width: number;
  height: number;
}

type IViewports = Array<IViewportDimensions>; // | Cypress.ViewportPreset>; // tsc errors if trying for a complex array structure type :(

interface IBreakpointGeneric extends Object {
  all: any;
  xs: any;
  sm: any;
  md: any;
  lg: any;
}

interface IBreakpointToViewport extends IBreakpointGeneric {
  all: IViewports;
  xs: IViewports;
  sm: IViewports;
  md: IViewports;
  lg: IViewports;
}

const breakpointsToViewports: IBreakpointToViewport = {
  // the sizes of the screens to use for testing. allows for multiple sizes tested at each level
  all: [minSupported, commonSmallPhone, tablet, smDesktop, lgDesktop],
  xs: [minSupported],
  sm: [commonSmallPhone],
  md: [tablet],
  lg: [smDesktop, lgDesktop],
};

interface IBreakpointToTestFns extends IBreakpointGeneric {
  all: Array<string>;
  xs: Array<string>;
  sm: Array<string>;
  md: Array<string>;
  lg: Array<string>;
}

// map the given breakpoint to the test function(s) to run.
// then run test functions that are allowed for the given screen size.
// eg, for 'desktop' run 'all' and 'lg' tests
// eg, for 'all' run every single exported function (all, xs to lg)
const breakpointToTestFns: IBreakpointToTestFns = {
  all: ["all", "xs", "sm", "md", "lg"],
  xs: ["all", "xs"],
  sm: ["all", "sm"],
  md: ["all", "md"],
  lg: ["all", "lg"],
};

// each test suite needs an export matching this interface type definition:
export interface ITestSuite {
  name: string;
  tests: { all: () => void; xs: () => void; sm: () => void; md: () => void; lg: () => void };
}

export default (desc: string, breakpoints: Array<"all"> | Array<"xs" | "sm" | "md" | "lg">, TestSuites: Array<ITestSuite>) => {
  describe(desc, () => {
    Cypress.Promise.onPossiblyUnhandledRejection((error, promise) => {
      console.error("unhandled rejection promise:", promise);
      throw error;
    });

    // multiple loops lookup the information from the structures defined at the top of this file.
    // basically:
    //  breakpoint -> viewport -> test suite function(s) to execute
    for (const breakpoint of breakpoints) {
      for (const viewport of breakpointsToViewports[breakpoint]) {
        for (const suite of TestSuites) {
          describe(`${suite.name} - ${breakpoint} (${viewportToString(viewport)})`, () => {
            beforeEach(() => {
              cy.viewport(viewport.width, viewport.height);
            });

            for (const testFn of breakpointToTestFns[breakpoint]) {
              suite.tests[testFn]();
            }
          });
        }
      }
    }
  });
};

function viewportToString(viewport: IViewportDimensions): string {
  return `${viewport.width}x${viewport.height}px`;
}
