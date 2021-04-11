import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CoursierComponentsPage, CoursierDeleteDialog, CoursierUpdatePage } from './coursier.page-object';

const expect = chai.expect;

describe('Coursier e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let coursierComponentsPage: CoursierComponentsPage;
  let coursierUpdatePage: CoursierUpdatePage;
  let coursierDeleteDialog: CoursierDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Coursiers', async () => {
    await navBarPage.goToEntity('coursier');
    coursierComponentsPage = new CoursierComponentsPage();
    await browser.wait(ec.visibilityOf(coursierComponentsPage.title), 5000);
    expect(await coursierComponentsPage.getTitle()).to.eq('coopcycleApp.coursier.home.title');
    await browser.wait(ec.or(ec.visibilityOf(coursierComponentsPage.entities), ec.visibilityOf(coursierComponentsPage.noResult)), 1000);
  });

  it('should load create Coursier page', async () => {
    await coursierComponentsPage.clickOnCreateButton();
    coursierUpdatePage = new CoursierUpdatePage();
    expect(await coursierUpdatePage.getPageTitle()).to.eq('coopcycleApp.coursier.home.createOrEditLabel');
    await coursierUpdatePage.cancel();
  });

  it('should create and save Coursiers', async () => {
    const nbButtonsBeforeCreate = await coursierComponentsPage.countDeleteButtons();

    await coursierComponentsPage.clickOnCreateButton();

    await promise.all([
      coursierUpdatePage.setNameInput('name'),
      coursierUpdatePage.setSurnameInput('surname'),
      coursierUpdatePage.setTransportMeanInput('transportMean'),
      coursierUpdatePage.setPhoneInput('118'),
      coursierUpdatePage.userSelectLastOption(),
    ]);

    expect(await coursierUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await coursierUpdatePage.getSurnameInput()).to.eq('surname', 'Expected Surname value to be equals to surname');
    expect(await coursierUpdatePage.getTransportMeanInput()).to.eq(
      'transportMean',
      'Expected TransportMean value to be equals to transportMean'
    );
    expect(await coursierUpdatePage.getPhoneInput()).to.eq('118', 'Expected Phone value to be equals to 118');

    await coursierUpdatePage.save();
    expect(await coursierUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await coursierComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Coursier', async () => {
    const nbButtonsBeforeDelete = await coursierComponentsPage.countDeleteButtons();
    await coursierComponentsPage.clickOnLastDeleteButton();

    coursierDeleteDialog = new CoursierDeleteDialog();
    expect(await coursierDeleteDialog.getDialogTitle()).to.eq('coopcycleApp.coursier.delete.question');
    await coursierDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(coursierComponentsPage.title), 5000);

    expect(await coursierComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
