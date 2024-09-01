import project from '../config/create-low-code-projects/webMobile.json';
import ide from '../../config/ide.json';
import { expect } from '@playwright/test';

export class Cloud {
  constructor(page, context) {
    this.page = page;
    this.iframe = page.frameLocator('#main');
  }

  async accessCloudWindow() {
    await this.iframe.locator('[ui-id="header-hambuguer"]').click();
    await this.iframe.locator('[ui-id="toolbar-cloudservice"]').click();
  }

  async searchService(serviceName) {
    await this.iframe.locator('[tabindex="32"] > *:nth-child(2)').fill(`${serviceName}.cronapp.io`);
    await this.page.waitForTimeout(3000);
    await this.page.keyboard.press('Space');
    await this.page.waitForTimeout(3000);
  }

  async accessEditOption(serviceName) {
    await this.iframe.locator(`//*[text()="${serviceName}.cronapp.io"]/../../..`).click({ button: 'right' });
    await this.iframe.locator('(//*[text()="Editar"])[3]').click();
    await this.page.waitForTimeout(5500);
    await expect(this.iframe.locator(`//*[text()="Configuração de ${serviceName}"]`)).toBeVisible();
  }

  async serviceUpdate() {
    await this.iframe.locator('//*[text()="Atualizar"]').click();
  }

  async incrementMinimumInstance(quantity) {
    for (let i = 0; i < quantity; i++) {
      await this.iframe.locator("(//*[@tabindex='28'])[2]/*[2]/*[1]").click();
    }
  }

  async decrementMinimumInstance(quantity) {
    for (let i = 0; i < quantity; i++) {
      await this.iframe.locator("(//*[@tabindex='28'])[2]/*[2]/*[2]").click();
    }
  }

  async incrementMaximumInstance(quantity) {
    for (let i = 0; i < quantity; i++) {
      await this.iframe.locator("(//*[@tabindex='30'])/*[2]/*[1]").click();
    }
  }

  async decrementMaximumInstance(quantity) {
    for (let i = 0; i < quantity; i++) {
      await this.iframe.locator("(//*[@tabindex='30'])/*[2]/*[2]").click();
    }
  }
}
