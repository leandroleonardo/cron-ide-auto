import { expect } from '@playwright/test';

export class MobileDevices {
  constructor(page, context) {
    this.page = page;
    this.iframe = page.frameLocator('#main');
  }

  async acessMobileDevices(destino) {
    await this.iframe.locator('[ui-id="header-hambuguer"]').click();
    await this.page.waitForTimeout(1000);
    await this.iframe.getByText('Deploy').first().click();
    await this.iframe.getByText('Dispositivos Móveis').first().click();
    await this.iframe.getByText(destino).click();
    await this.page.waitForTimeout(2000);
  }

  async generateApkAndroid() {
    await this.acessMobileDevices('Configurações');
    await this.iframe.locator('//*[@tabindex="47"]/*[1]/*[1]').fill('http://qaprojetocomponentes.cloud.cronapp.io/');
    await this.page.keyboard.press('Control+S');
    await this.acessMobileDevices('Compilar');
    await this.iframe.getByText('Android').click();
    await this.iframe.locator('//div[@style and contains(text(),"OK")]').click();
    await this.iframe.locator('//*[text()="Sua aplicação foi gerada com sucesso!"]').waitFor({ timeout: 480000 });
    await this.iframe.locator('//div[@style and contains(text(),"Baixar")]').nth(1).click();
  }

  async UrlErrorValidation() {
    await this.iframe.locator('[ui-id="header-hambuguer"]').click();
    await this.page.waitForTimeout(1000);
    await this.iframe.getByText('Deploy').first().click();
    await this.iframe.getByText('Dispositivos Móveis').first().click();
    await this.iframe.getByText('Compilar').click();
    await this.iframe.getByText('Android').click();
    await expect(this.iframe.getByText('Você precisa informar a URL de produção do Servidor!')).toBeVisible();
    await this.iframe.locator('//div[@style and contains(text(),"OK")]').click();
    await this.page.waitForTimeout(2000);
    await expect(this.iframe.getByText('URL do Servidor (produção)')).toBeVisible();
  }
}
