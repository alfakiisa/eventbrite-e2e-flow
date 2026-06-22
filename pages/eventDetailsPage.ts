import { type Locator, type Page, expect } from '@playwright/test';

export class EventDetailsPage {
    readonly eventPage: Page;
    readonly eventTitle: Locator;
    readonly reserveSpot: Locator;
    readonly checkAvailability: Locator;




    constructor(page: Page) {
        this.eventPage = page;
        this.eventTitle = page.locator('h1[data-automation="listing-title"]');
        this.reserveSpot = page.getByTestId('conversion-bar-checkout-button').getByText('Reserve a spot', { exact: true });
        this.checkAvailability = page.getByTestId('check-availability-button').getByText('Check availability', { exact: true });
    }

    async verifyEventTitle(expectedTitle: string) {
        await expect(this.eventTitle).toHaveText(expectedTitle, { timeout: 15000 });
    }


    async reserveASpot() {
        
        if (await this.reserveSpot.isVisible()) {
            await this.reserveSpot.click();
            // other actions to reserve a spot can be added here
        }
        else {
        await this.checkAvailability.click();
        }
    }
    // async clickMyProfile() {
    //     await this.myProfileBtn.click();
    // }

    // async clickLogIn() {
    //     await this.logInBtn.click();
    // }

}

export default EventDetailsPage;