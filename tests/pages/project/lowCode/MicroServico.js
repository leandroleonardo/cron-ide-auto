import { assert } from 'console';
import { InitialNavegate } from '../../InitialNavegate';
import { text } from 'stream/consumers';

let initialNavegate;

export class MicroServico {
  constructor(page, context) {
    this.page = page;
    this.iframe = page.frameLocator('#main');
    initialNavegate = new InitialNavegate(page, context);
  }

  async createProjectMicroServico(projectName, config) {
    const nextButton = await this.iframe.locator('div[ui-id="template-next-button"]');

    await initialNavegate.searchProject(projectName);
    await this.page.waitForTimeout(1000);

    const projectExistis = await this.iframe.getByText(projectName).nth(1).isVisible();
    if (projectExistis) await initialNavegate.deleteProject();

    await this.iframe.getByText('+ Novo Projeto').nth(1).click();
    await this.iframe.getByText('Microsserviço').click();
    await this.iframe.locator('input[ui-id="newProject-projectName-input"]').fill(projectName);
    await this.iframe.getByText('Finalizar').click();

    await this.iframe.locator('[ui-id="template-item-data-service"]').click();
    await this.page.waitForTimeout(1000);
    await nextButton.click();
    await this.page.waitForTimeout(1000);
    await this.iframe.locator('[ui-id="template-finish-button"]').click({ delay: 1000 });
    await this.iframe.locator('[ui-id="dialog_confirmation"]').waitFor({ timeout: 120000 });
    await this.iframe.locator('(//*[text()="Não"])[2]').click();
    await this.iframe.getByText(' Started').waitFor({ timeout: 100000 });

    await this.page.waitForTimeout(32000);
  }

  async runProject(device) {
    await this.iframe.locator('[ui-id="openProject-startDebugItem"]').first().click();
    await this.iframe
      .getByText('Aplicação iniciada com sucesso! Como você deseja abri-la?')
      .waitFor({ timeout: 120000 });
    await this.page.waitForTimeout(1000);
    if (device) await this.iframe.locator(`[ui-id="openProject-openRestDoc"]`).click();
  }

  async acessPage(newPage) {
    await newPage.waitForLoadState('load');
    await newPage.isVisible('div[id="swagger-ui"]');

  }

  async closeProject() {
    await this.iframe.getByText('Projeto').first().click();
    await this.iframe.getByText('Fechar').click();
    await this.iframe.getByText('Sim').click();
    await this.page.waitForTimeout(10000);
  }

  async createMicroServicoNegocio(projectName, config) {
    const nextButton = await this.iframe.locator('div[ui-id="template-next-button"]');

    await initialNavegate.searchProject(projectName);
    await this.page.waitForTimeout(1000);

    const projectExistis = await this.iframe.getByText(projectName).nth(1).isVisible();
    if (projectExistis) await initialNavegate.deleteProject();

    await this.iframe.getByText('+ Novo Projeto').nth(1).click();
    await this.iframe.getByText('Microsserviço').click();
    await this.iframe.locator('input[ui-id="newProject-projectName-input"]').fill(projectName);
    await this.iframe.getByText('Finalizar').click();

    await this.iframe.locator('[ui-id="template-item-business-service"]').click();
    await this.page.waitForTimeout(1000);
    await nextButton.click();
    await this.page.waitForTimeout(1000);
    await this.iframe.locator('[ui-id="template-finish-button"]').click({ delay: 1000 });
    await this.iframe.locator('[ui-id="dialog_confirmation"]').waitFor({ timeout: 120000 });
    await this.iframe.locator('(//*[text()="Não"])[2]').click();
    await this.iframe.getByText(' Started').waitFor({ timeout: 100000 });

    await this.page.waitForTimeout(32000);
  }
}
