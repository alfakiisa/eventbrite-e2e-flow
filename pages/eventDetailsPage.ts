import { type Locator, type Page, expect } from '@playwright/test';
import data from "../utils/data.json";

export class EventDetailsPage {
    readonly eventPage: Page;
    readonly eventTitle: Locator;
    readonly reserveSpot: Locator;
    readonly checkAvailability: Locator;
    readonly register: Locator 
    readonly firstNameField: Locator;
    readonly lastNameField: Locator;
    readonly emailField: Locator;
    readonly confirmEmailField: Locator;
    readonly passwordField: Locator;
    readonly phoneField: Locator;
    readonly completeOrder: Locator;
    readonly checkBoxOne: Locator;


    constructor(page: Page) {
        this.eventPage = page;
        this.eventTitle = page.locator('h1[data-automation="listing-title"]');
        this.reserveSpot = page.getByTestId('conversion-bar-checkout-button').getByText('Reserve a spot', { exact: true });
        this.checkAvailability = page.getByTestId('check-availability-button').getByText('Check availability', { exact: true });
        this.register = page.getByTestId('eds-modal__primary-button').getByText('Register', { exact: true });
        this.checkBoxOne = page.getByTestId('check-availability-button');
        this.firstNameField = page.getByPlaceholder('First name');
        this.lastNameField = page.getByPlaceholder('Last name');
        this.emailField = page.getByPlaceholder('Email address');
        this.confirmEmailField = page.getByPlaceholder('Confirm email');
        this.passwordField = page.getByPlaceholder('Password');
        this.phoneField = page.getByPlaceholder('Phone number');
        this.completeOrder = page.getByTestId('eds-modal__primary-button').getByText('Complete order', { exact: true });
    }


    async verifyEventTitle(expectedTitle: string) {
        await expect(this.eventTitle).toHaveText(expectedTitle, { timeout: 15000 });
    }


    async reserveASpot() {
    const password = process.env.PASSWORD as string || "";
        

        if (await this.reserveSpot.isVisible()) {
            await this.reserveSpot.click();
            // other actions to reserve a spot can be added here
        }
        else {
        await this.checkAvailability.click();
        }

        await this.eventPage.waitForLoadState('networkidle');
        await this.register.click();
        await this.eventPage.waitForLoadState('networkidle');

        // if user is not signed in, the sign-in page will be displayed. You can add code here to handle that scenario if needed.
        
        await this.firstNameField.fill(data.first_name);
        await this.lastNameField.fill(data.last_name);
        await this.emailField.fill(data.email_1);
        await this.confirmEmailField.fill(data.email_1);
        await this.phoneField.fill(data.phone_number);
        await this.passwordField.fill(password);

    }
    // async clickMyProfile() {
    //     await this.myProfileBtn.click();
    // }

    // async clickLogIn() {
    //     await this.logInBtn.click();
    // }

}

export default EventDetailsPage;