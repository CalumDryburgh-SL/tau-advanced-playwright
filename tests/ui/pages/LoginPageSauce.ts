import { type Page, type Locator, expect } from "@playwright/test";

class LoginPageSauce {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly messagePanel: Locator;
  readonly password: Locator;
  readonly userName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.messagePanel = page.locator('[data-test="error"]');
    this.password = page.getByPlaceholder("Password");
    this.userName = page.getByPlaceholder("UserName");
  }

  async fillEmail(email: string) {
    await this.userName.fill(email);
  }

  async fillPassword(password: string) {
    await this.password.fill(password);
  }

  async doLogin(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.loginButton.click();
  }

  async checkLoggedIn() {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.page).toHaveTitle(/Swag Labs/);
  }

  async checkInvalidCredentials() {
    await expect(this.messagePanel).toBeVisible();
  }
}

export default LoginPageSauce;
