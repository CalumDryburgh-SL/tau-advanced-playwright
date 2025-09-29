import { test, expect } from "../fixtures/books-fixture";
import { APIRequestContext, Page } from "@playwright/test";
import baseAPIUrl from "../../utils/environmentBaseUrl";
import deleteBookAPIRequest from "../../api/requests/delete-books-collection";
import addBookToCollection from "../../api/requests/create-books-collection";
import userData from "../../data/user-data";
import { connect } from "http2";

test.describe.configure({ mode: "serial" });

let apiContext: APIRequestContext;
const env = process.env.ENV!;
const password = process.env.PASSWORD!;
const userId = process.env.CALUMID!;
const userName = process.env.CALUMUSER!;
const URL = process.env.PROFURL!;

test.beforeAll(async ({ playwright }) => {
  apiContext = await playwright.request.newContext({
    baseURL: baseAPIUrl[env].api,
    extraHTTPHeaders: {
      Authorization: `Basic ${Buffer.from(`${userName}:${password}`).toString(
        "base64"
      )}`,
      Accept: "application/json",
    },
  });
});

test.describe("Books - Fixture & API", () => {
  test.use({ isDupe: false });
  test.use({ storageState: "storageState.json" });

  async function addBook(userId: string, page: Page, isbn: string) {
    const response = await addBookToCollection.addBookToCollection(
      apiContext,
      userId,
      isbn
    );

    // Verify that book was added added
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);
    await page.reload();
  }

  async function deleteBook(userId: string, page: Page, isbn: string) {
    const response = await deleteBookAPIRequest.deleteBookAPIByIsbn(
      apiContext,
      userId,
      isbn
    );

    // Verify that book was deleted
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(204);
    await page.reload();
  }

  test("add book to collection then delete it", async ({ page }) => {
    const isbn = userData.books.new;

    // Book collections clean up
    const deleteAllResponse = await deleteBookAPIRequest.deleteAllBooksByUser(
      apiContext,
      userId
    );
    expect(deleteAllResponse.ok()).toBeTruthy();

    // Add book to collection and verify that book was added
    await addBook(userId, page, isbn);

    // Delete book from collection and verify that book was deleted
    await deleteBook(userId, page, isbn);
  });
});
