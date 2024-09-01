import project from '../../config/projectTemplate/webMobile.json';
import { InitialNavegate } from '../InitialNavegate';

let initialNavegate;

export class WebMobile {
  constructor(page, context) {
    this.page = page;
    this.iframe = page.frameLocator('#main');
    initialNavegate = new InitialNavegate(page, context);
  }

  async createProjectMobileWeb(config) {
    const name = project[config].name;
    const nextButton = await this.iframe.locator('div[ui-id="template-next-button"]');
    const backupOptionLocator = project[config].backup == 'Sim' ? '//*[text()="Sim"]' : '(//*[text()="Não"])[2]';

    await initialNavegate.searchProject(name);
    const projectExistis = await this.iframe.getByText(name).nth(1).isVisible();
    if (projectExistis) await initialNavegate.deleteProject();

    await this.iframe.getByText('+ Novo Projeto').nth(1).click();
    await this.iframe.getByText('Mobile e Web').click();
    await this.iframe.locator('input[ui-id="newProject-projectName-input"]').fill(name);
    await this.iframe.getByText('Finalizar').click();

    await this.iframe.locator('[ui-id="template-item-cronapp-rad-project-mobile-cordova"]').click();
    await this.page.waitForTimeout(1000);
    await nextButton.click();
    await this.page.waitForTimeout(1000);

    await this.configureTheProject(config);

    await this.page.waitForTimeout(500);
    await nextButton.click();
    await this.page.waitForTimeout(500);
    await this.iframe.locator('[ui-id="template-finish-button"]').click({ delay: 1000 });
    await this.iframe.locator('[ui-id="dialog_confirmation"]').waitFor({ timeout: 120000 });
    await this.iframe.locator(backupOptionLocator).click();

    await this.iframe.getByText(' Started').waitFor({ timeout: 90000 });

    await this.page.waitForTimeout(47000);
  }

  async configureTheProject(config) {
    const configOption = async (option, configField) => {
      let selectedOption = project[config].config[configField];
      let locatorOption = this.iframe.locator(`[ui-id="wizard-template-${option}-control"]`);
      let locatorYes = this.iframe.getByText('Sim').nth(1); //locator('(//*[text()="Sim"])[2]');

      if (option == 'frontend' || option == 'backend') selectedOption = !selectedOption;
      if (selectedOption) await locatorOption.click();
      if (option == 'social' || option == 'mutual') await locatorYes.click;
    };

    const listOfSettings = new Map([
      ['appid', 'idAplication'],
      ['includeauth', 'includeAuth'],
      ['typeAuth', 'authentication'],
      ['social', 'loginSocial'],
      ['mutual', 'mutualAuth'],
      ['frontend', 'includeFrontEnd'],
      ['backend', 'includeBackEnd'],
    ]);

    for (const [key, value] of listOfSettings) {
      await configOption(key, value);
    }
  }

  async executeProject() {
    await this.iframe.locator('div[ui-id="openProject-startDebugItem"]').click();
    const navegateWebOption = this.iframe.locator("//*[text()='Navegador (Web)']");
    await navegateWebOption.waitFor({ timeout: 300000 });
    await this.page.waitForTimeout(2000);
    await this.iframe.getByText('Navegador (Web)').click();
  }

  async runBack() {
    await this.iframe.locator('[ui-id="openProject-startDebugItem"]').first().click();
  }

  async runProject(device) {
    await this.iframe.locator('[ui-id="openProject-startDebugItem"]').first().click();
    await this.iframe
      .getByText('Aplicação iniciada com sucesso! Como você deseja abri-la?')
      .waitFor({ timeout: 120000 });
    await this.page.waitForTimeout(1000);
    if (device) await this.iframe.locator(`[ui-id="openProject-runMobileWeb-${device}-btn"]`).click();
  }

  async accessRunningWebmobile(newPage) {
    await newPage.waitForLoadState('load');

    await newPage.isVisible('div[data-component="crn-image"]');
    await newPage.locator('input[id="input-login-username"]').fill('admin');
    await newPage.locator('input[id="input-login-password"]').fill('admin');
    await newPage.locator('div[id="crn-button-login"]').click();

    await newPage.getByText('Admin').click();
    await newPage.getByText('Users').click();
  }

  async loginWithSSO(newPage) {
    //const newPage = await context.waitForEvent('page');
    newPage.getByText('Login').click();
  }
}
