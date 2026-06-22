import { expect, Locator, Page } from "@playwright/test";

export class SignInPage {
    // variables
    readonly page: Page;
    readonly emailInput: Locator;
    readonly continueBtn: Locator;
    readonly otpInput: Locator;
    readonly signInBtn: Locator;
    readonly signInPageTitle: RegExp;

    // constructors
    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('input[data-testid="auth-lib-email-field"][type="email"]');
        this.continueBtn = page.locator('button[data-automation="form-submit-button"][type="submit"]');
        this.otpInput = page.locator('input[name="code"][type="text"]');
        this.signInBtn = page.getByRole('button', { name: 'Sign in' });
        this.signInPageTitle = /Sign In to Eventbrite/;
    }

    // methods
    async gotoUrl() {
        await this.page.goto('https://www.eventbrite.com/signin/');
    }   
    
    async enterEmail(email: string) {
        await this.emailInput.fill(email);
        await this.continueBtn.click();
    }

    async enterOtp(otp: string) {
        await this.otpInput.fill(otp);
        await this.signInBtn.click();
        await this.page.keyboard.press("Enter");
    }   
    async verifyPageTitle() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector('title');
        const title = await this.page.title();
        expect(title).toMatch(this.signInPageTitle);
    }   
}

export default SignInPage;
