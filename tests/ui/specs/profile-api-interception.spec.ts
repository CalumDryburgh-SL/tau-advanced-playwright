import { test, type Page, type BrowserContext } from "@playwright/test";
import {
  Eyes,
  Target,
  Configuration,
  BatchInfo,
} from "@applitools/eyes-playwright";
import ProfilePage from "../pages/profile-page";
import apiPaths from "../../utils/apiPaths";
import pages from "../../utils/pages";

let profilePage: ProfilePage;
let eyes: Eyes;

test.beforeAll(async () => {
  eyes = new Eyes();

  const configuration = new Configuration();
  configuration.setApiKey(process.env.APPLITOOLS_API_KEY!);
  configuration.setAppName("DemoQA BookStore");

  const batchInfo = new BatchInfo("Profile API Interception Batch");
  configuration.setBatch(batchInfo);

  configuration.setViewportSize({ width: 1280, height: 720 });

  eyes.setConfiguration(configuration);
});

test.beforeEach(async ({ page }) => {
  await page.goto("https://demoqa.com/profile");
  profilePage = new ProfilePage(page);
});

test.afterAll(async () => {
  await eyes.closeAsync();
  console.log("Eyes tests completed. Check Applitools dashboard for results.");
});

test.describe("Profile - API Interception with Applitools", () => {
  test("Sort books with visual validation", async ({ page, context }) => {
    // Open Eyes and start visual testing
    await eyes.open(page, "DemoQA BookStore", "Profile Sort Books Test");

    //intial state
    await eyes.check("Initial Profile Page", Target.window().fully());

    await watchAPICallAndMockResponse(page, context);
    await eyes.check("After API intercept", Target.window().fully());
    await profilePage.checkBooksList();
    await eyes.check("Books List Loaded", Target.window().fully());
    await profilePage.sortBooksList();
    await eyes.check("Books List Sorted", Target.window().fully());
    await profilePage.checkSort();

    //final
    await eyes.check("Final Sorted State", Target.window().fully());

    // Close Eyes for this test
    await eyes.closeAsync();
  });
});

async function watchAPICallAndMockResponse(
  page: Page,
  context: BrowserContext
) {
  await profilePage.mockBooksListResponse(context);
  const [response] = await Promise.all([
    page.waitForResponse(new RegExp(apiPaths.account)),
    page.reload(),
  ]);
  const responseData = await response.json();
  console.log("API Response received:", responseData);

  await page.waitForTimeout(1000);

  return responseData;
}
