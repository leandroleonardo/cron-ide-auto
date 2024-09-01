//import project from '../config/projectTemplate/webMobile.json';
import ide from '../config/ide.json';
import versionApp from '../versionApp.json';

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
    const index_memory = ide.env == 'ide-s' ? 0 : 1;

    await this.page.waitForTimeout(1000);
    await this.page.locator('#username').fill(process.env.EMAIL);
    await this.page.locator('#password').fill(process.env.PASSWORD);
    await this.page.click('#btnEntrar');

    await this.iframe.locator('select[name="billing_subscription"]').selectOption({ index: index_memory });

    await this.iframe.locator(`#memory_${ide.memory}`).click();
  }

  async getVersion() {
    const fs = require('fs');
    await this.iframe.getByText('Ajuda').click();
    await this.iframe.getByText('Sobre').click();
    const ideVersion = await this.page.frameLocator('#main').getByText('Modelo').textContent();
    await this.iframe.getByText('OK').nth(1).click();

    const content = `{"ide":"${ideVersion?.substring(8, 19)}"}`;

    fs.writeFile('tests\\versionApp.json', '', function (err) {
      if (err) console.log(`Erro ao limpar o arquivo: ${err}`);
    });

    fs.appendFile('tests\\versionApp.json', content, err => {
      if (err) console.error('Erro ao adicionar a linha:', err);
    });
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
    const deleteButton = `//div[contains (@style, 'rwt-resources/generated/${versionApp.ide}/workspace/tree/delete.svg')]`;
    await this.iframe.locator(deleteButton).click();
    await this.iframe.getByText('Sim').click();
  }

  async openProject(name) {
    const projectExistis = await this.searchProject(name);
    const projectsThumb = "//div[contains(@ui-class, 'project-thumb')]";

    if (!projectExistis) {
      console.log('\n\nProjeto não encontrado...\n\n');
      return;
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

    //await this.page.pause();

    await this.page.waitForTimeout(10000);
    await popupIsVisible('As seguintes bibliotecas têm novas versões. Gostaria de atualizá-las?', true);
    await popupIsVisible('Deseja habilitar o backup automático deste projeto?', false);

    await this.iframe.getByText(' Started').waitFor({ timeout: 60000 });
    await this.page.waitForTimeout(15000);

    // [INFO] BUILD SUCCESS

    //const teste = this.iframe.locator('[data-mode-id="Log"]');

    //await this.iframe.getByText('SAÍDA').nth(1).dblclick();
    //await this.page.waitForTimeout(2000);
    //await this.iframe.mouse.wheel(0, 10000);

    //await this.page.pause();
    //[data-mode-id="Log"]
  }

  async navegateToLink(linkTitle) {
    await this.iframeWelcome.locator(`//*[text()="${linkTitle}"]`).click();
  }
}
