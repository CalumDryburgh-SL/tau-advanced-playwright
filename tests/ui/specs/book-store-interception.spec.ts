import { test, expect } from "@playwright/test";
import BookPage from "../pages/book-page";
import books from "../../data/swagger";
import bookListData from "../../data/book-list-data";

const URL = process.env.URLSEARCH!;

test.describe("Book Store - Interception", () => {
  test.use({ storageState: "storageState.json" });
  // test.use({ isDupe: false });

  test("search for a book", async ({ page }) => {
    await page.goto(URL);
    const bookPage = new BookPage(page);
    await bookPage.search("java");
    await bookPage.getSearchResults();
  });
});

test("mock and dont call api", async ({ page }) => {
  await page.route("**/BookStore/v1/Books", async (route) => {
    console.log("Intercepting API call:", route.request().url());
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(bookListData),
    });
  });

  await page.goto(URL);

  // Wait for the page to load
  await page.waitForTimeout(2000);

  await expect(
    page.getByText("Learning JavaScript Design Patterns")
  ).toBeVisible();
});

test("sorts books by title using HTTPS interception", async ({ page }) => {
  // Create sorted mock data using existing book data
  const sortedBooksResponse = {
    ...bookListData,
    books: [...bookListData.books].sort((a, b) =>
      a.title.localeCompare(b.title)
    ),
  };

  console.log("Sorted Booksdfgsdfsfdsf Response:", sortedBooksResponse.books);
  // Intercept the books API and return sorted data
  await page.route("**/BookStore/v1/Books", async (route) => {
    console.log("Intercepting books API call for sorting test");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(sortedBooksResponse),
    });
  });

  await page.goto(URL);
  const bookPage = new BookPage(page);
  await page.waitForTimeout(2000);
  await bookPage.checkSortedByTitle();

  await expect(
    page.locator('text="Designing Evolvable Web APIs with ASP.NET"')
  ).toBeVisible();
  await expect(
    page.locator('text="Learning JavaScript Design Patterns"')
  ).toBeVisible();
});
