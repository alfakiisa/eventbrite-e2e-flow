import { test, expect } from '@playwright/test';
import { MailSlurp } from 'mailslurp-client';
import 'dotenv/config';
import SignInPage from '../pages/signInSignUpPage';


const mailslurp = new MailSlurp({
  apiKey: process.env.API_KEY!
});

test('eventbrite signup and login flow', async ({ page }) => {

  // create disposable inbox
  const inbox = await mailslurp.createInbox();

  const signInPage =new SignInPage(page);

  await signInPage.enterEmail(inbox.emailAddress);

  

  await page.goto('https://www.eventbrite.com/signin/');

  await page.fill('input[data-testid="auth-lib-email-field"][type="email"]', inbox.emailAddress);

  await page.click('button[data-automation="form-submit-button"][type="submit"]');


  // Eventbrite sends OTP email
  const loginEmail = await mailslurp.waitForLatestEmail(
    inbox.id,
    60000
  );

  // extract OTP
  const match = loginEmail.body?.match(/\d{6}/);

  expect(match).not.toBeNull();

  const otp = match![0];

  // fill OTP
  await page.fill('input[name="code"][type="text"]', otp);

  await page.click('button[type="submit"][data-action-button-primary="true"]');

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
    await expect(page.getByText('Country')).toBeVisible();
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