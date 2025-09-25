import { expect, test } from "@playwright/test";

const userName = process.env.SWAGUSER!;
const password = process.env.SWAGPASS!;
const URL = process.env.SWAGURL!;
const targetURL = process.env.INVURL!;

test.use({ storageState: { cookies: [], origins: [] } }); // doesn't share the logged in session
// test.use({ storageState: undefined }); // https://github.com/microsoft/playwright/issues/17396
test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
});

test.only(" Normal user sign in", async ({ page }) => {
  const usernamefield = page.getByPlaceholder("Username");
  const passwordfield = page.getByPlaceholder("Password");
  const signinbutton = page.getByRole("button", { name: "login" });

  await usernamefield.fill(userName);
  await passwordfield.fill(password);
  await signinbutton.click();

  await expect(page.url()).toBe(targetURL);
});
