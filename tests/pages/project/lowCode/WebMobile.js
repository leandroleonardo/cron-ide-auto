import project from '../../../config/projectTemplate/webMobile.json';
import { InitialNavegate } from '../../InitialNavegate';

let initialNavegate;

export class WebMobile {
  constructor(page, context) {
    this.page = page;
    this.iframe = page.frameLocator('#main');
    initialNavegate = new InitialNavegate(page, context);
  }

  async createProjectMobileWeb(projectName, config) {
    const nextButton = await this.iframe.locator('div[ui-id="template-next-button"]');

    await initialNavegate.searchProject(projectName);
    await this.page.waitForTimeout(1000);

    const projectExistis = await this.iframe.getByText(projectName).nth(1).isVisible();
    if (projectExistis) await initialNavegate.deleteProject();

    await this.iframe.getByText('+ Novo Projeto').nth(1).click();
    await this.iframe.getByText('Mobile e Web').click();
    await this.iframe.locator('input[ui-id="newProject-projectName-input"]').fill(projectName);
    await this.iframe.getByText('Finalizar').click();

    await this.iframe.locator('[ui-id="template-item-cronapp-rad-project-mobile-cordova"]').click();
    await this.page.waitForTimeout(1000);
    await nextButton.click();
    await this.page.waitForTimeout(1000);
    if (config) await this.configureTheProject(config);
    await this.page.waitForTimeout(500);
    await nextButton.click();
    await this.page.waitForTimeout(500);
    await this.iframe.locator('[ui-id="template-finish-button"]').click({ delay: 1000 });
    await this.iframe.locator('[ui-id="dialog_confirmation"]').waitFor({ timeout: 120000 });
    await this.iframe.locator('(//*[text()="Não"])[2]').click();
    await this.iframe.getByText(' Started').waitFor({ timeout: 100000 });

    await this.page.waitForTimeout(32000);
  }

  async createProjectWeb(projectName, config) {
    const nextButton = await this.iframe.locator('div[ui-id="template-next-button"]');

    await initialNavegate.searchProject(projectName);
    await this.page.waitForTimeout(1000);

    const projectExistis = await this.iframe.getByText(projectName).nth(1).isVisible();
    if (projectExistis) await initialNavegate.deleteProject();

    await this.iframe.getByText('+ Novo Projeto').nth(1).click();
    await this.iframe.getByText('Apenas Web').click();
    await this.iframe.locator('input[ui-id="newProject-projectName-input"]').fill(projectName);
    await this.iframe.getByText('Finalizar').click();

    await this.iframe.locator('[ui-id="template-item-cronapp-rad-project"]').click();
    await this.page.waitForTimeout(1000);
    await nextButton.click();
    await this.page.waitForTimeout(1000);
    if (config) await this.configureTheProject(config);
    await this.page.waitForTimeout(500);
    await nextButton.click();
    await this.page.waitForTimeout(500);
    await nextButton.click();
    await this.page.waitForTimeout(500);
    await this.iframe.locator('[ui-id="template-finish-button"]').click({ delay: 1000 });
    await this.iframe.locator('[ui-id="dialog_confirmation"]').waitFor({ timeout: 120000 });
    await this.iframe.locator('(//*[text()="Não"])[2]').click();
    await this.iframe.getByText(' Started').waitFor({ timeout: 100000 });

    await this.page.waitForTimeout(32000);
  }

  async configureTheProject(config) {
    const configOption = async (option, configField) => {
      let selectedOption = project[config].config[configField];
      let locatorOption = this.iframe.locator(`[ui-id="wizard-template-${option}-control"]`);
      let locatorYes = this.iframe.getByText('Sim').nth(1);

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

  async runProject(device) {
    await this.iframe.locator('[ui-id="openProject-startDebugItem"]').first().click();
    await this.iframe
      .getByText('Aplicação iniciada com sucesso! Como você deseja abri-la?')
      .waitFor({ timeout: 120000 });
    await this.page.waitForTimeout(1000);
    if (device == 'web') await this.iframe.locator(`[ui-id="openProject-runMobileWeb-${device}-btn"]`).click();
    else await this.iframe.locator("//div[contains (@style, 'rwt-resources/themes/images/6ef91d03.svg')]").click();
  }

  async closeTab() {
    await initialNavegate.exit();
  }

  async loginRunningWebmobile(newPage) {
    await newPage.waitForLoadState('load');

    await newPage.isVisible('div[data-component="crn-image"]');
    await newPage.locator('input[id="input-login-username"]').fill('admin');
    await newPage.locator('input[id="input-login-password"]').fill('admin');
    await newPage.locator('div[id="crn-button-login"]').click();

    await newPage.getByText('Admin').click();
    await newPage.getByText('Usuários').click();
  }

  async loginWithSSO(newPage) {
    await newPage.getByText('Login').click();
  }

  async closeProject() {
    await this.iframe.getByText('Projeto').first().click();
    await this.iframe.getByText('Fechar').click();
    await this.iframe.getByText('Sim').click();
    await this.page.waitForTimeout(10000);
  }
}
