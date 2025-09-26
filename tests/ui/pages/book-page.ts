import { type Page, type Locator, expect } from "@playwright/test";
import { buildUrl } from "../../utils/uiUrlBuilder";
import messages from "../../utils/messages";
import pages from "../../utils/pages";

class BookPage {
  readonly page: Page;
  readonly addToYourCollectionButton: Locator;
  readonly backToBookStoreButton: Locator;
  readonly isbnLabel: Locator;
  readonly speakingJSBook: Locator;
  readonly speakingJSBookIsbnLabel: Locator;
  readonly titleLabel: Locator;

  readonly searchBox: Locator;
  readonly bookResults: Locator;
  readonly noResultsMessage: Locator;
  readonly bookTitles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator("#searchBox");
    this.bookResults = page.locator(
      '.rt-tbody .rt-tr-group:not([style*="display: none"])'
    );
    this.noResultsMessage = page.locator(".rt-noData");
    this.bookTitles = page.locator(
      '.rt-tbody .rt-tr-group:not([style*="display: none"]) .rt-td:nth-child(2) a'
    );

    this.addToYourCollectionButton = page.getByText("Add To Your Collection", {
      exact: true,
    });
    this.backToBookStoreButton = page.getByText("Back To Book Store", {
      exact: true,
    });
    this.isbnLabel = page.locator("#ISBN-wrapper").nth(1);
    this.titleLabel = page.locator("#title-wrapper").locator("#userName-value");
  }

  async search(searchTerm: string) {
    await this.searchBox.fill(searchTerm);
    await this.page.waitForTimeout(500);
  }

  async clearSearch() {
    await this.searchBox.clear();
    await this.page.waitForTimeout(500);
  }

  async getSearchResults() {
    const titles = await this.bookTitles.allTextContents();
    return titles.filter((title) => title.trim() !== "");
  }

  async getSearchResultsCount() {
    const results = await this.getSearchResults();
    return results.length;
  }

  async checkSingleResult(expectedTitle: string) {
    const results = await this.getSearchResults();
    expect(results).toHaveLength(1);
    expect(results[0]).toBe(expectedTitle);
  }

  async checkMultipleResults(expectedMinCount: number = 1) {
    const resultCount = await this.getSearchResultsCount();
    expect(resultCount).toBeGreaterThanOrEqual(expectedMinCount);
  }

  async checkNoResults() {
    const resultCount = await this.getSearchResultsCount();
    expect(resultCount).toBe(0);
  }

  async checkSearchResultsContain(searchTerm: string) {
    const results = await this.getSearchResults();
    const containsSearchTerm = results.some((title) =>
      title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(containsSearchTerm).toBe(true);
  }

  async checkAllResultsContain(searchTerm: string) {
    const results = await this.getSearchResults();
    expect(results.length).toBeGreaterThan(0);

    for (const title of results) {
      expect(title.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
  }

  async goto(isbn: string) {
    const params = { book: isbn };
    const url = buildUrl(pages.bookStorePage, params);
    await this.page.goto(url);
  }

  async addToYourCollection(isDupe?: boolean) {
    if (isDupe) {
      let dialogMessage: string;

      this.page.on("dialog", async (dialog) => {
        dialogMessage = dialog.message();
        expect(dialogMessage).toBe(messages.book.duplicate);
        await dialog.accept();
      });
    }
    await this.addToYourCollectionButton.click();
  }

  async checkSpeakingJSIsbn() {
    await expect(this.speakingJSBookIsbnLabel).toBeVisible();
  }

  async checkTitle(title: string) {}

  async checkAddedToYourCollection(isDupe: boolean) {}

  async clickAtSpeakingJSBook() {
    await this.speakingJSBook.click();
  }

  async initiateListenerWhenAddToYourCollection() {
    let dialogMessage: string;
    let expectedDialogMessage: string;

    this.page.on("dialog", async (dialog) => {
      dialogMessage = dialog.message();
      expectedDialogMessage = messages.book.duplicate;
      expect(dialogMessage).toBe(expectedDialogMessage);
      await dialog.accept();
    });
  }
}

export default BookPage;
