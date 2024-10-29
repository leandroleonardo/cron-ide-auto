import ide from '../config/ide.json';

export class BasePage {
  constructor(page, context) {
    this.page = page;
    this.iframe = page.frameLocator('#main');
    this.iframeWelcome = this.iframe.frameLocator("//*[@ui-id='welcome-frame']/iframe");
  }

  async visit() {
    await this.page.goto(`https://${ide.env}.cronapp.io/`);
    await this.page.locator('#btnEntrar').waitFor({ timeout: 30000 });
  }

  async IDElogin() {
    await this.page.waitForTimeout(1000);
    await this.page.locator('#username').fill(process.env.EMAIL);
    await this.page.locator('#password').fill(process.env.PASSWORD);
    await this.page.click('#btnEntrar');

    let billing_subscription = await this.iframe.locator('#billing_subscription');
    let billing_ide =
      'ide' === ide['env']
        ? 'Techne Engenharia e Sistemas LTDA - LN Cronapp - Techne'
        : 'Techne Cronapp - não arquivar! - Techne - Sandbox';

    if (billing_subscription) {
      await this.iframe.locator('#billing_subscription').selectOption({ label: billing_ide });
    }

    await this.iframe.locator(`#memory_${ide.memory}`).click();
  }

  async IDELogout() {
    await this.iframe.locator('[id="rightTopBar"]').click();
    await this.iframe.locator('[onclick="exitIDE()"]').click();
    await this.page.waitForTimeout(1000);
  }

  async IDEopenProject(name) {
    const projectExistis = await this.searchProject(name);
    const projectsThumb = "//div[contains(@ui-class, 'project-thumb')]";

    if (!projectExistis) {
      throw new Error('\nProjeto não encontrado...\n');
    }

    await this.iframe.locator(projectsThumb).first().click();

    const popupIsVisible = async (text, option) => {
      let selectedOption = option ? '//*[text()="Sim"]' : '(//*[text()="Não"])[2]';
      let isVisible = await this.iframe.getByText(text).isVisible();
      if (isVisible) {
        await this.iframe.locator(selectedOption).click();
        if (option) await this.page.waitForTimeout(25000);
      }
    };

    await this.page.waitForTimeout(10000);

    await popupIsVisible('As seguintes bibliotecas têm novas versões. Gostaria de atualizá-las?', true);
    await popupIsVisible('Deseja habilitar o backup automático deste projeto?', false);

    await this.iframe.getByText(' Started').waitFor({ timeout: 100000 });
    await this.page.waitForTimeout(10000);
  }

  async searchProject(name) {
    await this.iframe.locator('[ui-id="main-menu-my-projects"]').click();
    await this.iframe.locator('input[ui-id="open-project-search-text"]').fill(`${name} `);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(2000);
    const projectIsVisible = await this.iframe.getByText(name).nth(1).isVisible();
    return projectIsVisible;
  }
}
