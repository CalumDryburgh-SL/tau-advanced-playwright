import { expect, test } from "@playwright/test";
import InventoryPageSauceDemo from "../pages/swagLogin";

const userName = process.env.SWAGUSER!;
const password = process.env.SWAGPASS!;
const URL = process.env.SWAGURL!;
const targetURL = process.env.INVURL!;

let inventoryPage: InventoryPageSauceDemo;

test.use({ storageState: ".auth/user.json" });

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
});

test.describe.skip("swag - Profile", () => {
  test.use({ storageState: ".auth/user.json" });
  test("Check log in", async ({ page }) => {
    inventoryPage = new InventoryPageSauceDemo(page);
    await inventoryPage.checkLoggedIn();
  });
});
