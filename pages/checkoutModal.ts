import { type FrameLocator, type Page, expect } from '@playwright/test';
import data from "../utils/data.json";


export class CheckoutModal {
    readonly checkoutPage: Page; 
    readonly iframe: FrameLocator;


    constructor (page: Page) {
        this.checkoutPage = page;
        this.iframe = page.frameLocator('iframe[data-automation^="checkout-widget-iframe"]');
        // await this.phoneField.fill(data.phone_number);
        // await this.passwordField.fill(password);
    }

        // iframe locators
    get registerBtn() {
        return this.iframe.getByTestId('eds-modal__primary-button');
    }

    get firstName() {
        return this.iframe.getByText('First name');
    }

    get lastName() {
        return this.iframe.getByText('Last name');
    }

    get emailField() {
        return this.iframe.getByText('Email address');
    }

    get confirmEmail() {
        return this.iframe.getByText('Confirm email');
    }

    get phoneField() {
        return this.iframe.getByPlaceholder('Phone number');
    }

    get passwordField() {
        return this.iframe.getByPlaceholder('Password');
    }

    get marketingOptInCheckbox() {
        return this.iframe.locator('#eb-marketing-opt-in');
    }

    get completeOrderBtn() {
        return this.iframe.getByTestId('eds-modal__primary-button').getByText('Complete order', { exact: true });
    }

    get takeMeToMyTickets() {
        return this.iframe.getByRole('link', {name: 'Take me to my tickets'});
        
    }

    get eventTitle() {
        return this.iframe.getByTitle('h3')
    }

    // methods
    async fillInDetails() {
        //const password = process.env.PASSWORD as string || "";

        await this.checkoutPage.waitForLoadState('networkidle');
        await this.registerBtn.click();
        await this.firstName.fill(data.first_name);
        await this.lastName.fill(data.last_name);
        await this.emailField.fill(data.email_1);
        await this.confirmEmail.fill(data.email_1);
        await this.marketingOptInCheckbox.uncheck();
        await expect(this.marketingOptInCheckbox).not.toBeChecked();
        await this.registerBtn.click();
        await this.checkoutPage.waitForTimeout(50000);
        // Assert success message: Thanks for your order!
        await expect(this.checkoutPage.getByText('Thanks for your order!')).toBeVisible();
        // click on take me to my tickets and wait for new page to open
        const [ticketPage] = await Promise.all([
            this.checkoutPage.context().waitForEvent('page', { timeout: 50000 }),
            this.takeMeToMyTickets.click()
        ]);
        
        return ticketPage;
    }

    async verifyEventDetails() {
        const eventDetails = await this.fillInDetails

    }

    
}    

export default CheckoutModal;