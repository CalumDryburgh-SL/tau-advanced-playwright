import { test as base } from "@playwright/test";
import BookPage from "../pages/book-page";

type SearchFixtures = {
  bookPage: BookPage;
};

export type SearchScenario = {
  searchTerm: string;
  expectedBehavior: "single" | "multiple" | "none";
  expectedMinResults?: number;
};

export const test = base.extend<SearchFixtures & SearchScenario>({
  searchTerm: "",
  expectedBehavior: "none",
  expectedMinResults: 1,

  bookPage: async ({ page }, use) => {
    await page.goto("https://demoqa.com/books");
    const bookPage = new BookPage(page);

    await use(bookPage);
  },
});

export { expect } from "@playwright/test";
