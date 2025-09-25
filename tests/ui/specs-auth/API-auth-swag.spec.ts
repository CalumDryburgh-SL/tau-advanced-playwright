import { expect, test } from "@playwright/test";
import InventoryPageSauce from "../pages/swagLogin";

const URL = process.env.SWAGURL!;

let inventoryPage: InventoryPageSauce;

test.use({ storageState: ".auth/user.json" });

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
});

test.describe.skip("swag - Profile", () => {
  test.use({ storageState: ".auth/user.json" });
  test("Check log in", async ({ page }) => {
    inventoryPage = new InventoryPageSauce(page);
    await inventoryPage.checkLoggedIn();
  });
});
