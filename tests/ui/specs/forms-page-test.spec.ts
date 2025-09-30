import { test } from "@playwright/test";
import FormPage from "../pages/form-page";
import formData from "../../data/form-data";
import pages from "../../utils/pages";

const URL = process.env.URLFORM!;

let formPage: FormPage;

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
  formPage = new FormPage(page);
});

test.describe.only("successfull form completion & submit", () => {
  test(`submit form with ${formData.account.firstName} ${formData.account.lastName} ${formData.account.mobileNumber}`, async () => {
    await formPage.doForm(
      formData.account.firstName,
      formData.account.lastName,
      formData.account.mobileNumber
    );
    await formPage.checkFormSubmit();
  });
});
