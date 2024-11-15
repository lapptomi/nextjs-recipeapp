/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from "cypress";

export default defineConfig({
  screenshotOnRunFailure: false,
  defaultCommandTimeout: 20000,
  requestTimeout: 20000,
  pageLoadTimeout: 20000,
  video: false,
  e2e: {
    experimentalRunAllSpecs: true,
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
