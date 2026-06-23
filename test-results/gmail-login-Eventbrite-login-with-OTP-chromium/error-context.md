# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gmail-login.spec.ts >> Eventbrite login with OTP
- Location: tests\gmail-login.spec.ts:6:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Country')
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText('Country')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e5]:
    - link "Skip Main Navigation" [ref=e6] [cursor=pointer]:
      - /url: "#skip-heading"
    - generic [ref=e7]:
      - generic [ref=e8]:
        - link "Eventbrite" [ref=e9] [cursor=pointer]:
          - /url: https://www.eventbrite.com
          - generic "Eventbrite" [ref=e10]:
            - img [ref=e11]
            - generic: Eventbrite
        - button "Trigger search event experience" [ref=e20] [cursor=pointer]:
          - generic [ref=e26]:
            - img [ref=e29]
            - generic [ref=e31]:
              - generic:
                - generic:
                  - generic: Trigger search event experience
              - combobox "Trigger search event experience" [disabled]
        - link "Browse Events" [ref=e33] [cursor=pointer]:
          - /url: https://www.eventbrite.com/d/local/all-events/?aff=oddtdtcreator
          - generic [ref=e34]: Browse Events
      - generic [ref=e35]:
        - generic [ref=e36]:
          - menubar [ref=e40]:
            - menuitem "Organize" [ref=e41] [cursor=pointer]:
              - generic [ref=e43]: Organize
              - img [ref=e46]
          - menubar [ref=e51]:
            - menuitem "Help" [ref=e52] [cursor=pointer]:
              - generic [ref=e54]: Help
              - img [ref=e57]
        - menubar [ref=e62]:
          - menuitem "alfakihamma@gmail.com" [ref=e63] [cursor=pointer]:
            - generic [ref=e64]:
              - img [ref=e68]
              - generic [ref=e71]: alfakihamma@gmail.com
            - img [ref=e74]
    - generic [ref=e76]: Page Content
  - generic [ref=e82]:
    - main [ref=e85]:
      - generic [ref=e86]:
        - generic [ref=e89]:
          - generic [ref=e90]:
            - heading "Tell us what you love" [level=1] [ref=e91]
            - generic [ref=e92]: Customize your event recommendations based on your interests.
          - generic [ref=e94]:
            - generic [ref=e95]: Step 2 of 3
            - generic [ref=e96]:
              - progressbar "progressbar" [ref=e97]
              - progressbar [ref=e99]
        - main [ref=e100]:
          - generic [ref=e106]:
            - img [ref=e107]
            - progressbar [ref=e109]
    - generic [ref=e111]:
      - button "Previous" [ref=e112] [cursor=pointer]
      - button "Next" [ref=e113] [cursor=pointer]
```

# Test source

```ts
  1  | // tests/eventbrite-login.spec.ts
  2  | 
  3  | import { test, expect } from "@playwright/test";
  4  | import { waitForEventbriteOtp } from "../utils/otpHelper";
  5  | 
  6  | test("Eventbrite login with OTP", async ({ page }) => {
  7  |   await page.goto("https://www.eventbrite.com/signin");
  8  | 
  9  |   await page.fill(
  10 |     'input[data-testid="auth-lib-email-field"][type="email"]', "alfakihamma@gmail.com");
  11 |   // await page.fill('[type="email"]', "alfakihamma@gmail.com");
  12 | 
  13 |   await page.click('button[data-automation="form-submit-button"][type="submit"]');
  14 |   // await page.click('button:has-text("Continue")');
  15 | 
  16 |   // Eventbrite sends OTP email
  17 |   const otp = await waitForEventbriteOtp();
  18 | 
  19 |   console.log("OTP:", otp);
  20 | 
  21 |   await page.fill('input[name="code"][type="text"]', otp);
  22 |   // await page.fill('input[type="text"]', otp);
  23 | 
  24 |   // await page.click('button[type="submit"][data-action-button-primary="true"]');
  25 |   await page.keyboard.press("Enter");
  26 | 
  27 |   await expect(page).toHaveURL(/eventbrite/i);
  28 | 
  29 |   // enter first name and last name if prompted (for new accounts)
  30 |   const firstNameField = page.locator('input[id="af_uid_405"][name="first_name"][type="text"]');
  31 |   const lastNameField = page.locator('input[id="af_uid_407"][name="last_name"][type="text"]');
  32 | 
  33 |    //if (await firstNameField.isVisible()) {
  34 |     await firstNameField.click();
  35 |     await firstNameField.fill('Test');
  36 |     await lastNameField.click();
  37 |     await lastNameField.fill('User');
  38 |     // submit name form
  39 |     await page.click('button[type="button"][class="af-button af-nextButton"]');
  40 |     // assert login success
  41 |     await expect(page).toHaveTitle(/Eventbrite - Log In and Sign In/); //(/welcome to eventbrite/i);
  42 |     // select one of the options to proceed
  43 |     await expect(page.getByText('Find an experience')).toBeVisible();
  44 |     await page.getByText('Find an experience').click();
  45 |     // set Abuja as location
  46 |     await page.fill('input[data-spec="input-field-input-element"][name="locationPicker"][id="locationPicker"]', 'Abuja');
  47 |     await page.keyboard.press('Enter');
  48 |     // implicit wait for page to load
  49 |     //await page.waitForLoadState('networkidle');
  50 |     // click next button
  51 |     await page.click('button[type="button"][class="eds-btn eds-btn--button eds-btn--fill eds-btn--responsive"]');
  52 |     // wait for the next page to load
  53 |      //await page.waitForLoadState('networkidle');
  54 |     // select Country as genre of interest
> 55 |     await expect(page.getByText('Country')).toBeVisible();
     |                                             ^ Error: expect(locator).toBeVisible() failed
  56 |     await page.getByText('Country').click();
  57 |     // click next button
  58 |     await page.click('button[type="button"][class="eds-btn eds-btn--button eds-btn--fill eds-btn--responsive"]');
  59 |     // click finish button
  60 |     await page.click('button[type="button"][class="eds-btn eds-btn--button eds-btn--fill eds-btn--responsive"]');
  61 |   //} else {
  62 |     //console.log('First name and last name fields not visible, skipping...');
  63 |  // } 
  64 |   
  65 |   // final assertion
  66 |   await expect(page).toHaveTitle(/Eventbrite - Discover the Best Local Events & Things to Do/);
  67 | 
  68 |   await page.pause();
  69 | });
```