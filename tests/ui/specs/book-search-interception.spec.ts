import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import BookStorePage from "../pages/book-page";
import apiPaths from "../../utils/apiPaths";
import pages from "../../utils/pages";

let bookStorePage: BookStorePage;

test.beforeEach(async ({ page }) => {
  await page.goto("https://demoqa.com/books");
  bookStorePage = new BookStorePage(page);
});

test.describe("Book Store - API Interception", () => {
  test("Search books with API interception", async ({ page }) => {
    const mockBooksResponse = {
      books: [
        {
          isbn: "9781449331818",
          title: "Learning JavaScript Design Patterns",
          subTitle: "A JavaScript and jQuery Developer's Guide",
          author: "Addy Osmani",
          publish_date: "2020-06-04T09:11:40.000Z",
          publisher: "O'Reilly Media",
          pages: 254,
          description:
            "With Learning JavaScript Design Patterns, you'll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language.",
          website:
            "http://www.addyosmani.com/resources/essentialjsdesignpatterns/book/",
        },
        {
          isbn: "9781449337711",
          title: "Designing Evolvable Web APIs with ASP.NET",
          subTitle: "Harnessing the Power of the Web",
          author: "Glenn Block et al.",
          publish_date: "2020-06-04T09:12:43.000Z",
          publisher: "O'Reilly Media",
          pages: 238,
          description:
            "Design and build Web APIs for a broad range of clients—including browsers and mobile devices—that can adapt to change over time.",
          website:
            "http://chimera.labs.oreilly.com/books/1234000001708/index.html",
        },
      ],
    };

    await page.route("**/BookStore/v1/Books", async (route) => {
      console.log("Intercepting books API call:", route.request().url());
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockBooksResponse),
      });
    });

    await page.reload();
    await page.waitForTimeout(2000);

    await bookStorePage.clearSearch();
    await bookStorePage.search("Learning JavaScript Design Patterns");
    await bookStorePage.getSearchResults();

    await expect(
      page.locator('text="Learning JavaScript Design Patterns"')
    ).toBeVisible();
  });
});
