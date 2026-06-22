// tests/eventbrite-login.spec.ts

import { test, expect } from "@playwright/test";
import { waitForEventbriteOtp } from "../utils/otpHelper";
import { SignInPage } from "../pages/signInSignUpPage";
import { HomePage } from "../pages/homePage";

test.describe("Eventbrite Login", () => {
  let signInPage: SignInPage;
  let homePage: HomePage;

  test("Eventbrite login with OTP", async ({ page }) => {

    signInPage = new SignInPage(page);
    homePage = new HomePage(page);

    await signInPage.gotoUrl();
    await signInPage.enterEmail("alfakihamma@gmail.com");

    // Eventbrite sends OTP email
    const otp = await waitForEventbriteOtp();

    console.log("OTP:", otp);

    await signInPage.enterOtp(otp);
    await expect(page).toHaveURL(/eventbrite/i);

    // enter first name and last name if prompted (for new accounts)
    const firstNameField = page.locator('input[id="af_uid_405"][name="first_name"][type="text"]');
    const lastNameField = page.locator('input[id="af_uid_407"][name="last_name"][type="text"]');

    //if (await firstNameField.isVisible()) {
      await firstNameField.click();
      await firstNameField.fill('Test');
      await lastNameField.click();
      await lastNameField.fill('User');
      // submit name form
      await page.click('button[type="button"][class="af-button af-nextButton"]');
      // assert login success
      await expect(page).toHaveTitle(/Eventbrite - Log In and Sign In/); //(/welcome to eventbrite/i);
      // select one of the options to proceed
      await expect(page.getByText('Find an experience')).toBeVisible();
      await page.getByText('Find an experience').click();
      // set Abuja as location
      await page.fill('input[data-spec="input-field-input-element"][name="locationPicker"][id="locationPicker"]', 'Abuja');
      await page.keyboard.press('Enter');
      // implicit wait for page to load
      //await page.waitForLoadState('networkidle');
      // click next button
      await page.click('button[type="button"][class="eds-btn eds-btn--button eds-btn--fill eds-btn--responsive"]');
      // wait for the next page to load
      //await page.waitForLoadState('networkidle');
      // select Country as genre of interest
      await page.waitForLoadState('networkidle');
      // await expect(page.getByText('Country')).toBeVisible();
      await page.getByText('Country').click();
      // click next button
      await page.click('button[type="button"][class="eds-btn eds-btn--button eds-btn--fill eds-btn--responsive"]');
      // click finish button
      await page.click('button[type="button"][class="eds-btn eds-btn--button eds-btn--fill eds-btn--responsive"]');
      //} else {
      //console.log('First name and last name fields not visible, skipping...');
      // } 
    
      // final assertion
    await expect(page).toHaveTitle(/Eventbrite - Discover the Best Local Events & Things to Do/);
    await page.pause();
  });

});