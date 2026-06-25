import { test} from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { SignInPage } from '../pages/signInSignUpPage'; 
import { EventDetailsPage } from '../pages/eventDetailsPage';
import { CheckoutModal } from '../pages/checkoutModal'


test.describe.serial('Eventbrite', () => {
  let homePage: HomePage;
  let signInPage: SignInPage;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();

    homePage = new HomePage(page);
    signInPage = new SignInPage(page);

    await homePage.gotoUrl();
  });

  test.afterAll(async () => {
    await homePage.homePage.close();
  });

  test('page has title', async () => {
   await homePage.verifyPageTitle();
  });

  test('search for an event', async () => {
   // Enter location of interest
   await homePage.selectLocation();

   // Enter search key word in search bar
   await homePage.searchEvent();
  });

   test('search for science and technology events', async () => {
   await homePage.filterEventsByCategory();
  });

  test('search for events holding on this weekend', async () => {
   // Filter by events happening this week
   await homePage.filterEventsByDate();
  
  });

  test('search for free events', async () => {
    // Filter by free events
   await homePage.filterEventsByPrice();
  });

  test('select an event', async () => {
   await homePage.selectFirstEvent();
  });

  test('reserve a spot or check availability', async () => {
    const eventPage = await homePage.selectFirstEvent();
    const checkoutModal = new CheckoutModal(eventPage)
    const eventDetailsPage = new EventDetailsPage(eventPage);

    await eventDetailsPage.clickReserve();
    await checkoutModal.fillInDetails();
  });

  test.skip('view and download ticket', async () => {
  });

  // test('sign in to an account', async () => {
  //  // Click on the sign in button
  //   await homePage.clickSignIn();
  // });

});