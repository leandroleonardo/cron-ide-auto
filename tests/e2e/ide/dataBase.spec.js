import { DataBase } from '../../pages/ide/DataBase';
import { test, expect } from '@playwright/test';
import { projectName } from '../../config/project.json';

let dataBase;

test.beforeEach(async ({ page, context }) => {
  test.setTimeout(65000);
  dataBase = new DataBase(page, context);

  await dataBase.visit();
  await dataBase.IDElogin();
});

test.afterEach(async ({ page, context }, testInfo) => {
  const image = await page.screenshot();
  await testInfo.attach('screenshot', {
    body: image,
    contentType: 'image/png',
  });
  await dataBase.IDELogout();
});

test('Valida o acesso a tela de banco de dados', async ({ page, context }, testInfo) => {
  test.setTimeout(250000);
  await dataBase.IDEopenProject(projectName);
  await dataBase.accessDataBase();
  await expect(page.frameLocator('#main').getByText('jdbc/main')).toBeVisible();
});

test('Valida o acesso a tela de adicionar banco de dados', async ({ page, context }, testInfo) => {
  test.setTimeout(250000);
  await dataBase.IDEopenProject(projectName);
  await dataBase.accessDataBase();
  await dataBase.accessAddDataBase();
  await dataBase.savedAllchanges();
  await expect(page.frameLocator('#main').getByText('Novo banco de dados na nuvem')).toBeVisible();
});
