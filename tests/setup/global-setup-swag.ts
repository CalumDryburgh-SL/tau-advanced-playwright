import { expect, chromium, FullConfig } from "@playwright/test";

const userName = process.env.SWAGUSER!;
const password = process.env.SWAGPASS!;
const URL = process.env.SWAGURL!;
const targetURL = process.env.INVURL!;

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch({ headless: true, timeout: 10000 });
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await context.tracing.start({ screenshots: true, snapshots: true });
    await page.goto(URL);
    const usernameField = page.getByPlaceholder("Username");
    const passwordField = page.getByPlaceholder("Password");
    const signInButton = page.getByRole("button", { name: "Login" });

    await usernameField.fill(userName);
    await passwordField.fill(password);
    await signInButton.click();

    expect(page.url()).toBe(targetURL);
    await page.context().storageState({ path: storageState as string });
    await context.tracing.stop({
      path: "./test-results/setup-trace.zip",
    });
    await browser.close();
  } catch (error) {
    await context.tracing.stop({
      path: "./test-results/setup-trace.zip",
    });
    await browser.close();
    throw error;
  }
}

export default globalSetup;
