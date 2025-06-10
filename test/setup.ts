import * as testUtils from "@test/utils/test-utils";

declare global {
  // eslint-disable-next-line no-var
  var testUtils: typeof import("@test/utils/test-utils");
}

global.testUtils = testUtils;
