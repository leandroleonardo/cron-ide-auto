const { InitialNavegate } = require('../../pages/InitialNavegate');
const { DataBase } = require('../../pages/ide/DataBase');
const { WebMobile } = require('../../pages/project/lowCode/WebMobile');
const { test, expect } = require('@playwright/test');

let initialNavegate, iframe, webMobile, dataBase;

test.beforeEach(async ({ page, context }) => {
  iframe = page.frameLocator('#main');
  initialNavegate = new InitialNavegate(page, context);
  webMobile = new WebMobile(page, context);
  dataBase = new DataBase(page, context);

  await initialNavegate.visit();
  await initialNavegate.login();
  await initialNavegate.getVersion();
});

test.afterEach(async ({ page, context }, testInfo) => {
  const image = await page.screenshot();
  await testInfo.attach('screenshot', {
    body: image,
    contentType: 'image/png',
  });
});

test.describe('Execução 1', () => {
  test.describe.configure({ mode: 'serial' });

  const projectName = 'cron-auto-db-1';

  test('Cria projeto para execuções', async () => {
    await webMobile.createProjectMobileWeb(projectName);
  });

  test('Acessar tela de banco de dados', async ({ page, context }, testInfo) => {
    await initialNavegate.openProject(projectName);
    await dataBase.accessDataBase();
    await expect(iframe.getByText('jdbc/main')).toBeVisible();
  });

  test('Deleta projeto', async () => {
    await initialNavegate.searchProject(projectName);
    await initialNavegate.deleteProject();
    await expect(iframe.getByText(projectName).nth(1)).toBeHidden();
  });
});

test.describe('Execução 2', () => {
  test.describe.configure({ mode: 'serial' });

  const projectName = 'cron-auto-db-2';

  test('Cria projeto', async () => {
    await webMobile.createProjectMobileWeb(projectName);
  });

  test('Acessar tela de Adicionar banco de dados', async ({ page, context }, testInfo) => {
    await initialNavegate.openProject(projectName);
    await dataBase.accessDataBase();
    await dataBase.accessAddDataBase();
    await expect(iframe.getByText('Novo banco de dados na nuvem')).toBeVisible();
  });

  test('Deleta projeto', async () => {
    await initialNavegate.searchProject(projectName);
    await initialNavegate.deleteProject();
    await expect(iframe.getByText(projectName).nth(1)).toBeHidden();
  });
});
