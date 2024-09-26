const { InitialNavegate } = require('../../pages/InitialNavegate');
const { DataBase } = require('../../pages/ide/DataBase');
const { WebMobile } = require('../../pages/project/lowCode/WebMobile');
const { test, expect } = require('@playwright/test');

let initialNavegate, iframe, webMobile, dataBase;

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(360000);

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

test.describe.only('Execução 1 - Cloud', () => {
  const nameProject = 'cron-auto-db-1';
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(360000);

  test('Cria projeto para execuções', async () => {
    await webMobile.createProjectMobileWeb(nameProject, 'config_default');
  });

  test('Acessar tela de banco de dados', async ({ page, context }, testInfo) => {
    await initialNavegate.openProject(nameProject);
    await dataBase.accessDataBase();
    await expect(iframe.getByText('jdbc/main')).toBeVisible();
  });

  test('Deleta projeto', async () => {
    await initialNavegate.searchProject(nameProject);
    await initialNavegate.deleteProject();
    await expect(iframe.getByText(nameProject).nth(1)).toBeHidden();
  });
});

test.describe.only('Execução 2 - Cloud', () => {
  const nameProject = 'cron-auto-db-2';
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(360000);

  test('Cria projeto', async () => {
    await webMobile.createProjectMobileWeb(nameProject, 'config_default');
  });

  test('Acessar tela de Adicionar banco de dados', async ({ page, context }, testInfo) => {
    await initialNavegate.openProject(nameProject);
    await dataBase.accessDataBase();
    await dataBase.accessAddDataBase();
    await expect(iframe.getByText('Novo banco de dados na nuvem')).toBeVisible();
  });

  test('Deleta projeto', async () => {
    await initialNavegate.searchProject(nameProject);
    await initialNavegate.deleteProject();
    await expect(iframe.getByText(nameProject).nth(1)).toBeHidden();
  });
});
