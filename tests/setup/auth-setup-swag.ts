import { APIRequestContext, test as setup, type Page } from "@playwright/test";
import LoginPageSauceDemo from "../ui/pages/swagLogin";

const userName = process.env.SWAGUSER!;
const password = process.env.SWAGPASS!;
const URL = process.env.SWAGURL!;
const targetURL = process.env.INVURL!;
const adminUserName = process.env.ADMINSWAGUSER!;

const standardUserFile = ".auth/user.json";

setup("authenticate as standard user", async ({ page }) => {
  await doLogin(page, userName, password);
  await page.context().storageState({ path: standardUserFile });
});

const adminUserFile = ".auth/admin.json";

setup("authenticate as admin user", async ({ page }) => {
  await doLogin(page, adminUserName, password);
  await page.context().storageState({ path: adminUserFile });
});

setup("authenticate", async ({ request }) => {
  // Send authentication request. Replace with your own.
  await request.post(URL, {
    form: {
      user: userName,
      password: password,
    },
  });
  await request.storageState({ path: standardUserFile });
});

setup("authenticate admin", async ({ request }) => {
  // Send authentication request. Replace with your own.
  await request.post(URL, {
    form: {
      user: userName,
      password: password,
    },
  });
  await request.storageState({ path: standardUserFile });
});

async function doLogin(page: Page, user: string, password: string) {
  const loginPage = new LoginPageSauceDemo(page);

  await page.goto(URL);
  await loginPage.doLogin(user, password);
  //await page.waitForURL(URL + targetURL);
  await loginPage.checkLoggedIn();
}
