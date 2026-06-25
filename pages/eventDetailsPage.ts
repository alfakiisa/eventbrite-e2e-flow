import { type Page, type Locator, expect } from '@playwright/test';
import CheckoutModal from './checkoutModal';

export class EventDetailsPage {
    readonly eventPage: Page;
    readonly checkoutModal: CheckoutModal
    readonly eventTitle: Locator;
    readonly reserveSpot: Locator;
    readonly checkAvailability: Locator;
    readonly register: Locator 
    readonly passwordField: Locator;
    readonly phoneField: Locator;
    readonly completeOrder: Locator;

    constructor(page: Page) {
        this.eventPage = page;
        this.checkoutModal = new CheckoutModal (page);
        this.eventTitle = page.locator('h1[data-automation="listing-title"]');
        this.reserveSpot = page.getByTestId('conversion-bar-checkout-button').getByText('Reserve a spot', { exact: true });
        this.checkAvailability = page.getByTestId('check-availability-button').getByText('Check availability', { exact: true });
        this.register = page.getByTestId('eds-modal__main').getByTestId('eds-modal__primary-button');
        this.passwordField = page.getByPlaceholder('Password');
        this.phoneField = page.getByPlaceholder('Phone number');
        this.completeOrder = page.getByTestId('eds-modal__primary-button').getByText('Complete order', { exact: true });
    }

    async verifyEventTitle(expectedTitle: string) {
        await expect(this.eventTitle).toHaveText(expectedTitle, { timeout: 15000 });
    }

    async clickReserve() {
        if (await this.reserveSpot.isVisible()) {
                await this.reserveSpot.click();
            }

        else {
                await this.checkAvailability.click();
                // add steps ...
            }
    }
}

export default EventDetailsPage;