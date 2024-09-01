import { expect } from '@playwright/test';

export class Config {
  constructor(page, context) {
    super();
    this.page = page;
    this.iframe = page.frameLocator('#main');
  }

  async openConfigNavBar() {
    const locator_text = this.iframe.locator("//*[text()=' Started']");
    await locator_text.waitFor({ timeout: 300000 });

    await this.iframe.getByText('Projeto').click();
    await this.iframe.getByText('Configurações').click();
    await this.iframe.locator('//*[text()="Configurações de E-mail"]').click();
  }

  async openConfigTree() {
    const locator_text = this.iframe.locator("//*[text()=' Started']");
    await locator_text.waitFor({ timeout: 300000 });

    await this.iframe.getByText('Projeto').click();
    await this.iframe.getByText('Configurações').click();
    await this.iframe.locator('//*[text()="Configurações de E-mail"]').click();
  }
}
