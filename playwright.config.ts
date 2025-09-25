import { defineConfig, devices } from "@playwright/test";
import baseEnvUrl from "./tests/utils/environmentBaseUrl";

require("dotenv").config({ path: "./.env", override: true });

export default defineConfig({
  globalSetup: require.resolve("./tests/setup/global-setup-swag"),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: undefined,
  reporter: "html",
  // timeout: 5000,
  use: {
    storageState: "storageState.json",
    trace: "on",
    baseURL:
      process.env.ENV === "production"
        ? baseEnvUrl.production.home
        : process.env.ENV === "staging"
        ? baseEnvUrl.staging.home
        : baseEnvUrl.local.home,
  },

  projects: [
    {
      name: "auth-setup-swag",
      testMatch: /auth-setup-swag\.ts/,
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "storageState.json",
      },
    },
    {
      name: "chromium-auth",
      use: {
        ...devices["Desktop Chrome"],
        storageState: ".auth/user.json", //use this in case you have multiple projects one per user
      },
      dependencies: ["auth-setup-swag"],
    },
  ],
});
