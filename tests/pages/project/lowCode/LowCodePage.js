import { BasePage } from '../../BasePage';

export class LowCodePage extends BasePage {
  constructor(page, context) {
    super(page);
  }

  async runProject() {
    await this.iframe.locator('[ui-id="openProject-startDebugItem"]').first().click();
    await this.iframe
      .getByText('Aplicação iniciada com sucesso! Como você deseja abri-la?')
      .waitFor({ timeout: 120000 });
    await this.page.waitForTimeout(1000);
  }

  async openProject(location) {
    // Opções disponíveis: Projeto WebMobile: web, mobile - Projeto Microsserviço: API e DATA
    const project = await this.iframe.locator("//div[contains (@style, '/workspace/project/s.svg')]").isVisible();
    const device = project ? `openRest${location}` : `runMobileWeb-${location}-btn`;
    await this.iframe.locator(`[ui-id="openProject-${device}"]`).click();
  }

  async closeProject() {
    await this.iframe.getByText('Projeto').first().click();
    await this.iframe.getByText('Fechar').click();
    await this.iframe.getByText('Sim').click();
    await this.page.waitForTimeout(10000);
  }

  async deleteProject() {
    await this.iframe.locator("//div[contains (@style, '/workspace/tree/delete.svg')]").first().click();
    await this.iframe.getByText('Sim').click();
    await this.page.waitForTimeout(500);
  }
}
