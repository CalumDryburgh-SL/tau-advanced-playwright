import { test } from "@playwright/test";
import FormPage from "../pages/form-page";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import path from "path";

const URL = process.env.URLFORM!;

// Read and parse CSV file
const csvFilePath = path.join(__dirname, "../../data/form-data-CSV.csv");
const csvContent = readFileSync(csvFilePath, "utf-8");
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

let formPage: FormPage;

test.beforeEach(async ({ page }) => {
  await page.goto(URL);
  formPage = new FormPage(page);
});

test.describe.only("successful form completion & submit with CSV data", () => {
  for (const record of records) {
    test(`submit form with ${record.firstName} ${record.lastName}`, async () => {
      await formPage.doForm(record.firstName, record.lastName, record.mobile);
      await formPage.checkFormSubmit();
    });
  }
});
