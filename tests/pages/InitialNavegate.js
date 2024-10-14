import ide from '../config/ide.json';

export class InitialNavegate {
  constructor(page, context) {
    this.page = page;
    this.iframe = page.frameLocator('#main');
    this.iframeWelcome = this.iframe.frameLocator("//*[@ui-id='welcome-frame']/iframe");
  }

  async visit() {
    await this.page.goto(`https://${ide.env}.cronapp.io/`);
  }

  async login() {
    const account_type = ide.env == 'ide-s' || ide.env == 'ide-a' ? 0 : 1;

    await this.page.waitForTimeout(1000);
    await this.page.locator('#username').fill(process.env.EMAIL);
    await this.page.locator('#password').fill(process.env.PASSWORD);
    await this.page.click('#btnEntrar');

    let billing_subscription = await this.iframe.locator('select[name="billing_subscription"]');

    if (billing_subscription) {
      await this.iframe.locator('select[name="billing_subscription"]').selectOption({ index: account_type });
    }

    await this.iframe.locator(`#memory_${ide.memory}`).click();

    await this.page.waitForTimeout(8000);
    let termsOfServiceScreen = await this.iframe.locator('//*[text()="Termos de Serviço Beta do Cronapp"]').isVisible();
    if (termsOfServiceScreen) await this.iframe.getByText('Concordo').click();

    await this.page.waitForTimeout(10000);
    let updatePopupIsVisible = await this.iframe
      .locator("//text()[contains(., 'Nova versão do Cronapp lançada')]")
      .isVisible();
    console.log(updatePopupIsVisible);
    if (updatePopupIsVisible) await this.iframe.getByText('OK').click();
  }

  async getVersion() {
    await this.iframe.getByText('Ajuda').click();
    await this.iframe.getByText('Sobre').click();
    const ideVersion = await this.iframe.getByText('Modelo').textContent();
    await this.iframe.getByText('OK').nth(1).click();
    return ideVersion.substring(8, 19);
  }

  async searchProject(name) {
    await this.iframe.getByText('Meus Projetos').click();
    await this.iframe.locator('input[ui-id="open-project-search-text"]').fill(`${name} `);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(2000);
    const projectIsVisible = await this.iframe.getByText(name).nth(1).isVisible();
    return projectIsVisible;
  }

  async deleteProject() {
    const deleteButton = `//div[contains (@style, 'rwt-resources/generated/${await this.getVersion()}/workspace/tree/delete.svg')]`;
    await this.iframe.locator(deleteButton).first().click();
    await this.iframe.getByText('Sim').click();
    await this.page.waitForTimeout(500);
  }

  async openProject(name) {
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

  async navegateToLink(linkTitle) {
    await this.iframeWelcome.locator(`//*[text()="${linkTitle}"]`).click();
  }
}
