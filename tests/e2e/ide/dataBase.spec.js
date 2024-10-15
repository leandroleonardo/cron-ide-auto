const { InitialNavegate } = require('../../pages/InitialNavegate');
const { DataBase } = require('../../pages/ide/DataBase');
const { test, expect } = require('@playwright/test');
const { projectName } = require('../../config/project.json');

let initialNavegate, iframe, dataBase;

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(65000);
  iframe = page.frameLocator('#main');
  initialNavegate = new InitialNavegate(page, context);
  dataBase = new DataBase(page, context);

  await initialNavegate.visit();
  await initialNavegate.login();
});

test.afterEach(async ({ page, context }, testInfo) => {
  const image = await page.screenshot();
  await testInfo.attach('screenshot', {
    body: image,
    contentType: 'image/png',
  });
});

test('Valida o acesso a tela de banco de dados', async ({ page, context }, testInfo) => {
  test.setTimeout(250000);
  await initialNavegate.openProject(projectName);
  await dataBase.accessDataBase();
  await expect(iframe.getByText('jdbc/main')).toBeVisible();
});

test('Valida o acesso a tela de adicionar banco de dados', async ({ page, context }, testInfo) => {
  test.setTimeout(250000);
  await initialNavegate.openProject(projectName);
  await dataBase.accessDataBase();
  await dataBase.accessAddDataBase();
  await expect(iframe.getByText('Novo banco de dados na nuvem')).toBeVisible();
});
