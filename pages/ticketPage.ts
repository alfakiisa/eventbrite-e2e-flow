import { type Locator, type Page, expect } from '@playwright/test';

export class TicketPage {
    // variables
    readonly ticketPage: Page;
    readonly downloadTicketBtn: Locator;



    // constructor
    constructor(page: Page) {
        this.ticketPage = page;
        this.downloadTicketBtn = page.getByTestId('get-tickets-button');
    }

   
    // methods
    async downloadTicket () {
        // Verify details on event ticket


        
        await this.downloadTicketBtn.click();


    }
    
}


export default TicketPage;