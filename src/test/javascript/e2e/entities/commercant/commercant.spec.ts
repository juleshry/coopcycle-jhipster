import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CommercantComponentsPage, CommercantDeleteDialog, CommercantUpdatePage } from './commercant.page-object';

const expect = chai.expect;

describe('Commercant e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let commercantComponentsPage: CommercantComponentsPage;
  let commercantUpdatePage: CommercantUpdatePage;
  let commercantDeleteDialog: CommercantDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Commercants', async () => {
    await navBarPage.goToEntity('commercant');
    commercantComponentsPage = new CommercantComponentsPage();
    await browser.wait(ec.visibilityOf(commercantComponentsPage.title), 5000);
    expect(await commercantComponentsPage.getTitle()).to.eq('coopcycleApp.commercant.home.title');
    await browser.wait(ec.or(ec.visibilityOf(commercantComponentsPage.entities), ec.visibilityOf(commercantComponentsPage.noResult)), 1000);
  });

  it('should load create Commercant page', async () => {
    await commercantComponentsPage.clickOnCreateButton();
    commercantUpdatePage = new CommercantUpdatePage();
    expect(await commercantUpdatePage.getPageTitle()).to.eq('coopcycleApp.commercant.home.createOrEditLabel');
    await commercantUpdatePage.cancel();
  });

  it('should create and save Commercants', async () => {
    const nbButtonsBeforeCreate = await commercantComponentsPage.countDeleteButtons();

    await commercantComponentsPage.clickOnCreateButton();

    await promise.all([
      commercantUpdatePage.setCompanyNameInput('companyName'),
      commercantUpdatePage.setAddressInput('address'),
      commercantUpdatePage.setPhoneInput('phone'),
      commercantUpdatePage.userSelectLastOption(),
    ]);

    expect(await commercantUpdatePage.getCompanyNameInput()).to.eq('companyName', 'Expected CompanyName value to be equals to companyName');
    expect(await commercantUpdatePage.getAddressInput()).to.eq('address', 'Expected Address value to be equals to address');
    expect(await commercantUpdatePage.getPhoneInput()).to.eq('phone', 'Expected Phone value to be equals to phone');

    await commercantUpdatePage.save();
    expect(await commercantUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await commercantComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Commercant', async () => {
    const nbButtonsBeforeDelete = await commercantComponentsPage.countDeleteButtons();
    await commercantComponentsPage.clickOnLastDeleteButton();

    commercantDeleteDialog = new CommercantDeleteDialog();
    expect(await commercantDeleteDialog.getDialogTitle()).to.eq('coopcycleApp.commercant.delete.question');
    await commercantDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(commercantComponentsPage.title), 5000);

    expect(await commercantComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
