import { expect, Locator, Page } from "@playwright/test";

class InventoryPageSauce {
  readonly page: Page;
  readonly firstInventoryImage: Locator;
  readonly secondInventoryImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstInventoryImage = page.getByAltText("Sauce Labs Bike Light");
    this.secondInventoryImage;
  }

  async checkLoggedInNormalUser() {
    await expect(this.page).toHaveTitle(/Swag Labs/);
    await expect(this.page).toHaveURL(/inventory/);
  }

  async checkLoggedIn() {
    const imageURL = "/static/media/bike-light-1200x1500.37c843b0.jpg";
    await expect(this.firstInventoryImage).toHaveAttribute("src", imageURL);
  }

  async checkLoggedInAdmin() {
    const imageURL = "/static/media/sl-404.168b1cce.jpg";
    await expect(this.secondInventoryImage).toHaveAttribute("src", imageURL);
  }
}

export default InventoryPageSauce;
