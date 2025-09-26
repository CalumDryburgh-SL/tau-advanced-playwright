import { test, expect } from "../fixtures/book-store-search-fixture";

test.describe("Search Tests", () => {
  const searchScenarios = [
    {
      searchTerm: "You Don't Know JS",
      expectedBehavior: "single" as const,
      description: "single result for exact title",
    },
    {
      searchTerm: "java",
      expectedBehavior: "multiple" as const,
      expectedMinResults: 2,
      description: "multiple results for 'java'",
    },
    {
      searchTerm: "playwright",
      expectedBehavior: "none" as const,
      description: "no results for 'playwright'",
    },
  ];

  searchScenarios.forEach(
    ({ searchTerm, expectedBehavior, expectedMinResults, description }) => {
      test(`should handle ${description}`, async ({ bookPage }) => {
        await bookPage.search(searchTerm);

        switch (expectedBehavior) {
          case "single":
            await bookPage.checkSingleResult(searchTerm);
            break;
          case "multiple":
            await bookPage.checkMultipleResults(expectedMinResults || 1);
            await bookPage.checkAllResultsContain(searchTerm);
            break;
          case "none":
            await bookPage.checkNoResults();
            break;
        }
      });
    }
  );
});
