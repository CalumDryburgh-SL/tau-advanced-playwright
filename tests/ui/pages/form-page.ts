import { Page } from "@playwright/test";

class FormPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
export default FormPage;
