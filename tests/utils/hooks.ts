import { Page } from "@playwright/test";
import { buildUrl } from "./uiUrlBuilder";
import BookPage from "../ui/pages/book-page";
import LoginPage from "../ui/pages/login-page";
import ProfilePage from "../ui/pages/profile-page";
import FormPage from "../ui/pages/form-page";

async function beforeEach(
  page: Page,
  PageObjectParam: LoginPage | BookPage | ProfilePage | FormPage,
  targetPage: string,
  params?: Record<any, any>
) {
  await page.goto(buildUrl(targetPage, params));
  const pageObject = await new PageObjectParam(page);
  return pageObject;
}

export default { beforeEach };
