import { Locator, Page, expect } from "@playwright/test";
import formData from "../../data/form-data";

class FormPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly gender: Locator;
  readonly mobile: Locator;
  readonly submit: Locator;
  readonly dialogbox: Locator;
  readonly formDataRequest: RegExp;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator("#firstName");
    this.lastName = page.locator("#lastName");
    this.gender = page.locator(".custom-control-label").nth(0);
    this.mobile = page.getByPlaceholder("Mobile Number");
    this.submit = page.getByRole("button", { name: "Submit" });
    this.dialogbox = page.locator("#example-modal-sizes-title-lg");
    // this.formDataRequest = new RegExp();
  }
  async fillFirstName(firstName: string) {
    await this.firstName.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastName.fill(lastName);
  }

  async fillGender() {
    await this.gender.check();
  }

  async fillMobile(mobile: string) {
    await this.mobile.fill(mobile);
  }

  // async doForm() {
  //   JSON.stringify({ ...formData });
  //   await this.fillFirstName(formData.account.firstName);
  //   await this.fillLastName(formData.account.lastName);
  //   await this.fillGender();
  //   await this.fillMobile(formData.account.mobileNumber);
  //   await this.submit.click();
  // }
  async doForm(firstName: string, lastName: string, mobile: string) {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillGender();
    await this.fillMobile(mobile);
    await this.submit.click();
  }

  async checkFormSubmit() {
    expect(this.dialogbox.getByText("Thanks for submitting the form"));
  }
}
export default FormPage;
