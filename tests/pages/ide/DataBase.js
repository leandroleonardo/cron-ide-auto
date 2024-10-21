import { expect } from '@playwright/test';

export class DataBase {
  constructor(page, context) {
    this.page = page;
    this.iframe = page.frameLocator('#main');
  }

  async accessDataBase() {
    await this.iframe.locator('[ui-id="header-hambuguer"]').click();
    await this.iframe.locator('[ui-id="openProject-datasource"]').click();
  }

  async accessAddDataBase() {
    await this.iframe.locator('[ui-id="context-btnForm"]').click();
  }

  async savedAllchanges() {
    await this.page.waitForTimeout(1000);
    await this.iframe.locator('[ui-id="toolbar-save-all"]').click();
  }
}
