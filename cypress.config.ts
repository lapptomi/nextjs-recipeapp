/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from "cypress";

export default defineConfig({
  screenshotOnRunFailure: false,
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  pageLoadTimeout: 10000,
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
