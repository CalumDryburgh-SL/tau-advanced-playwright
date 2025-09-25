import { test } from "@playwright/test";
import FormPage from "../pages/form-page";
import pages from "../../utils/pages";

const firstName = "harry";
const lastName = "brown";
const mobile = "7535053484";
const URL = process.env.URLFORM!;

let formPage: FormPage;

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
  formPage = new FormPage(page);
});

test.describe.only("successfull form completion & submit", () => {
  test(`successfull form`, async () => {
    await formPage.doForm(firstName, lastName, mobile);
    await formPage.checkFormSubmit();
  });
});
