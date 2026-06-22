import { type Locator, type Page, expect } from '@playwright/test';

export class HomePage {
    // variables
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchBar: Locator;
    readonly locationInput: Locator;
    readonly myProfileBtn: Locator;
    readonly logInBtn: Locator;
    readonly filterPanel: Locator;
    readonly categoryFilter: Locator;
    readonly dateFilter: Locator;
    readonly priceFilter: Locator;
    readonly formatFilter: Locator;
    readonly languageFilter: Locator;
    readonly currencyFilter: Locator;
    readonly eventCards: Locator;
    detectedLocation: string = '';

    
    // constructor
    constructor(page: Page) {
        this.page = page;
        this.searchBar = page.getByTestId('input-field-wrapper');
        this.searchInput = this.searchBar.locator('input[class="InputField_input__dueMV"][id="search-autocomplete-input"]');
        this.locationInput = page.locator('input[class="InputField_input__dueMV"][id="location-autocomplete"]');
        this.myProfileBtn = page.locator(`#user-chunky_svg__eds-icon--user-chunky_svg`);
        this.logInBtn = page.getByText('Log In', { exact: true });
        this.filterPanel = page.getByTestId('filter-panel-desktop-container');
        this.categoryFilter = this.filterPanel.getByTestId('filter-section__category');
        this.dateFilter = page.getByTestId('filter-section__date');
        this.priceFilter = this.filterPanel.getByTestId('filter-section__price');
        this.formatFilter = this.filterPanel.getByTestId('filter-section__format');
        this.languageFilter = this.filterPanel.getByTestId('filter-section__language');
        this.currencyFilter = this.filterPanel.getByTestId('filter-section__currency');
        this.eventCards = page.locator('.discover-search-desktop-card'); 

    };
    
    // methods
    async gotoUrl() {
        const context = this.page.context();

        await context.grantPermissions(
            ['geolocation'],
            { origin: 'https://www.eventbrite.com' }
        );

        await this.page.goto('https://www.eventbrite.com/');
    }  

    async verifyPageTitle() {
        const homePageTitle = /Eventbrite - Discover the Best/;
        const title = await this.page.title();
        
        await this.page.waitForLoadState('domcontentloaded');
        expect(title).toMatch(homePageTitle);
        await this.page.waitForTimeout(5000); 
    }

    async selectLocation() {
        const currentLocation = this.page.getByRole('menuitem', { name: 'Use my current location' });
        const pageTitle = this.page.locator('h2.BucketHeader_title__tffwD');

        await this.locationInput.clear();
        await this.locationInput.click();
        await currentLocation.click();
        await this.page.waitForTimeout(5000); // wait for the location to be detected
        await this.locationInput.press('Enter');
        await this.page.waitForLoadState('networkidle');
        this.detectedLocation = await this.locationInput.inputValue();
        await expect(pageTitle).toContainText(`Events in ${this.detectedLocation}`);
        return this.detectedLocation;
    }

    async searchEvent(eventName: string = 'tech events') {
        const pageTitle = this.page.locator('h1.search-header__bot-title-display');

        await this.searchInput.first().click();
        await this.searchInput.first().fill(eventName);
        await this.searchInput.first().press('Enter');
        // await this.page.waitForLoadState('networkidle');
        await expect(pageTitle).toContainText(`Tech Events and Things to do in ${this.detectedLocation}`);
    }

    async filterEventsByCategory() {
        const viewMoreCategory = this.page.locator('#view-more-category').getByTestId('read-more-toggle');
        const filterByScienceAndTech = this.categoryFilter.getByText('Science & Tech');
        // wait for page to load and the filter panel to be visible
        await this.page.waitForLoadState('networkidle');
        await expect(this.filterPanel).toBeVisible();
        // Click on the "View More" button to reveal all categories
        await viewMoreCategory.click({ force: true });
        // Wait for 5 seconds to allow the page to update
        await this.page.waitForTimeout(5000); 
        await filterByScienceAndTech.click();
        // Wait for 5 seconds to allow the page to update
        await this.page.waitForTimeout(5000);
    }   

    async filterEventsByPrice() {
        const filterByFree = this.filterPanel.getByText('Free');
        await this.page.waitForTimeout(5000); 
        await filterByFree.check();
        await this.page.waitForTimeout(5000);
        await expect(filterByFree).toBeChecked(); 
    }    

    async filterEventsByTomorrow() {
        const filterByTomorrow = this.filterPanel.getByText('Tomorrow');
        await filterByTomorrow.check();
    }   

    async filterEventsByDate() {
        const filterByThisWeekend = this.filterPanel.getByText('This weekend');
        
        await filterByThisWeekend.click();
        await expect(filterByThisWeekend).toBeChecked();
        // Wait for 5 seconds to allow the page to update
        await this.page.waitForTimeout(5000);
        await this.page.waitForLoadState('networkidle');
    }   

    async selectFirstEvent() {
        // const pageTitle = this.page.locator('h1', { hasText: 'Free tech Events and Things to do in Abuja, Nigeria this weekend' });
        const pageTitle = this.page.locator('h1.search-header__bot-title-display')
        const firstEvent = this.eventCards.first()
        const eventName = await firstEvent.locator('h3').textContent();

        // Wait for the title to update after filters are applied
        // await expect(pageTitle).toContainText('Free', { timeout: 15000 });
        // await expect(pageTitle).toContainText('this weekend', { timeout: 15000 });
        await expect(pageTitle).toContainText(this.detectedLocation, { timeout: 15000 });
        // Print the number of event cards found on the page
        console.log(await this.eventCards.count());
       
        // Click on the first event card and wait for the new page to load
        const [eventPage] = await Promise.all([
            this.page.context().waitForEvent('page', { timeout: 50000 }),
            firstEvent.click()
            ]);

        await eventPage.waitForLoadState('networkidle');
        
        // capture the first event name and verify it on the event details page
        await expect(eventPage.getByRole('heading', { name: eventName! })).toBeVisible();
        await expect(eventPage.getByRole('heading', { name: eventName! })).toContainText(eventName!);
        console.log(`Selected event: ${eventName}`);

        return eventPage;
    }
}

export default HomePage; //(null as unknown as Page);
